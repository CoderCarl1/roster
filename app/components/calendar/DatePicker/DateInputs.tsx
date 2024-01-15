import { useRef, useState } from 'react';
import { dates, joinClasses } from '@functions';
import { NumberInput } from '../..';
import { useCalendar } from '../calendar.hooks';
import Button_CalendarIcon from './Button_CalendarIcon';

type DateInputProps = {
    children?: React.ReactNode;
    className?: string;
} & React.HTMLProps<HTMLDivElement>;
export default function DateInputs({
    children,
    className = '',
    ...props
}: DateInputProps) {
    const [showCalendar, setShowCalendar] = useState(false);

    function handleShowCalendar() {
        setShowCalendar((prev) => !prev);
    }

    return (
        <div className={joinClasses(className, 'calendar__wrapper')} {...props}>
            <div className="date__inputs--wrapper">
                <Inputs />
                <Button_CalendarIcon onClick={handleShowCalendar} />
            </div>
            <div className="calendar__content--wrapper">
                {showCalendar ? children : null}
            </div>
        </div>
    );
}

function Inputs() {
    const { setCalendarDate, currentCalendarDate } = useCalendar();
    const { daysInMonth } = dates.dateParts(currentCalendarDate);
    const ref = useRef<HTMLDivElement>(null);

    // const [ cursorPosition, setCursorPosition ] = useState<{ elementName: string | null, positionNumber: number }>({
    //   elementName: null,
    //   positionNumber: 0
    // })

    // useEffect(() => {
    //   if (!cursorPosition.elementName || !ref.current) return;
    //   const element = ref.current.querySelector(`[name="${cursorPosition.elementName}"]`) as HTMLInputElement;
    //   element.setSelectionRange(cursorPosition.positionNumber, cursorPosition.positionNumber);
    //   setCursorPosition({elementName: null, positionNumber: 0});
    // }, [ cursorPosition.positionNumber, cursorPosition.elementName ])

    function handleValueChange(
        calendarType: string,
        element?: HTMLInputElement | null,
        value?: number
    ) {
        const DATE_VALUES: Record<string, number> = {
            day: currentCalendarDate.getDate(),
            month: currentCalendarDate.getMonth(),
            year: currentCalendarDate.getFullYear(),
        };

        if (element) {
            const MAX = parseInt(element?.max, 10);
            const MIN = parseInt(element?.min, 10);
            const VALUE = value || parseInt(element?.value, 10);

            if (!VALUE) return;

            DATE_VALUES[calendarType] = VALUE;
            if (MIN && VALUE < MIN) _handleMin(calendarType);
            if (MAX && VALUE > MAX) _handleMax(calendarType);

            // doing this because dates are 0 indexed
            if (calendarType === 'month') {
                DATE_VALUES.month--;
            }

            setCalendarDate(
                new Date(DATE_VALUES.year, DATE_VALUES.month, DATE_VALUES.day)
            );
            return;
        }

        if (!element && value) {
            if (!ref.current) return;
            const inputElement = ref.current!.querySelector(
                `input[name="${calendarType}"]`
            ) as HTMLInputElement;
            return handleValueChange(calendarType, inputElement, value);
        }

        function _handleMin(calendarType: string) {
            if (calendarType === 'day') {
                DATE_VALUES.month--;
                if (DATE_VALUES.month < 0) {
                    DATE_VALUES.month = 11;
                    DATE_VALUES.year--;
                }
            }
            if (calendarType === 'month') {
                DATE_VALUES.year--;
            }
            const { daysInMonth } = dates.dateParts(
                new Date(DATE_VALUES.year, DATE_VALUES.month, 1)
            );
            DATE_VALUES.day = daysInMonth;
        }
        function _handleMax(calendarType: string) {
            if (calendarType === 'day') {
                DATE_VALUES.month++;
                if (DATE_VALUES.month > 11) {
                    DATE_VALUES.month = 0;
                    DATE_VALUES.year++;
                }
            }
            if (calendarType === 'month') {
                DATE_VALUES.year++;
            }
            DATE_VALUES.day = 1;
        }
    }

    function handleInputValuechange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const element = event.currentTarget;
        const calendarType = event.currentTarget.name;
        if (element && calendarType) {
            handleValueChange(calendarType, element);
        }
    }

    function handleFocus(event: React.KeyboardEvent<HTMLInputElement>) {
        const inputName = event.currentTarget.name;
        const currentEl = ref.current!.querySelector(
            `input[name="${inputName}"]`
        ) as HTMLInputElement | null;
        if (!currentEl) return;
        // const caretLocation = currentEl.selectionStart || 0;

        switch (event.key) {
            case 'Tab':
                event.shiftKey
                    ? _focusPrevElement(inputName)
                    : _focusNextElement(inputName);
                break;

            case 'Backspace':
                if (currentEl.value.length === 1) {
                    event.preventDefault(); // Prevent the default backspace behavior
                    handleValueChange(currentEl.name, null, 1);
                    _focusPrevElement(inputName);
                }
                break;
            case 'ArrowUp':
                handleValueChange(
                    currentEl.name,
                    null,
                    parseInt(currentEl.value) + 1
                );
                break;
            case 'ArrowDown':
                handleValueChange(
                    currentEl.name,
                    null,
                    parseInt(currentEl.value) - 1
                );
                break;
            case 'ArrowLeft':
                if (currentEl.selectionStart === 0) {
                    _focusPrevElement(inputName);
                }
                break;
            case 'ArrowRight':
                if (currentEl.selectionStart === currentEl.value.length) {
                    _focusNextElement(inputName);
                }
                break;
            default:
                break;
        }

        // setCursorPosition({
        //   elementName: currentEl.name, positionNumber: caretLocation
        // })

        function _focusPrevElement(currentFieldName: string) {
            // if (!currentFieldName){
            //  TODO: focus the first element within day and then fire a shift tab event
            //   return;
            // }
            const { prev } = getFieldsToFocus(currentFieldName);
            if (!prev) return;

            event.preventDefault();
            prev.focus();
            prev.setSelectionRange(prev.value.length, prev.value.length);
        }
        function _focusNextElement(currentFieldName: string) {
            const { next } = getFieldsToFocus(currentFieldName);
            if (!next) return;

            event.preventDefault();
            next.focus();
            next.setSelectionRange(0, 0);
        }

        function getFieldsToFocus(currentFieldName: string) {
            const fieldOrder = ['day', 'month', 'year'];
            const select = (name: string) =>
                ref.current!.querySelector(
                    `input[name="${name}"]`
                ) as HTMLInputElement | null;
            const currentIndex = fieldOrder.indexOf(currentFieldName);
            let prevFocusable, nextFocusable;
            if (currentIndex === 0) {
                prevFocusable = null;
                nextFocusable = select('month');
            }
            if (currentIndex === 1) {
                prevFocusable = select('day');
                nextFocusable = select('year');
            }
            if (currentIndex === 2) {
                prevFocusable = select('month');
                nextFocusable = null;
            }

            return {
                prev: prevFocusable,
                next: nextFocusable,
            };
        }
    }
    // Hacky workaround because number inputs dont allow cursor manipulation
    function changeType(event: React.FocusEvent<HTMLInputElement>) {
        const currentEl = event.currentTarget;
        const newType = currentEl.type === 'number' ? 'text' : 'number';
        currentEl.type = newType;
    }
    function leadingZeros(value: string | number) {
        const number = typeof value === 'string' ? parseInt(value) : value;
        const length = `${value}`.length;
        if (!isNaN(number) && length === 1) {
            value = `0${value}`;
        }
        return value;
    }
    const commonInputProps = {
        onChange: handleInputValuechange,
        onKeyDown: handleFocus,
        onBlur: changeType,
        onFocus: changeType,
        editable: true,
    };

    return (
        <div className="date__inputs" ref={ref}>
            <NumberInput
                aria-placeholder="dd"
                placeholder="dd"
                aria-label="day"
                aria-valuemin={1}
                aria-valuemax={daysInMonth}
                min={1}
                max={daysInMonth}
                maxLength={2}
                value={leadingZeros(currentCalendarDate.getDate())}
                formKey={'day'}
                {...commonInputProps}
            />
            <NumberInput
                aria-placeholder="MM"
                placeholder="MM"
                aria-label="month"
                aria-valuemin={1}
                aria-valuemax={12}
                maxLength={2}
                min={1}
                max={12}
                value={leadingZeros(currentCalendarDate.getMonth() + 1)}
                formKey={'month'}
                {...commonInputProps}
            />
            <NumberInput
                aria-placeholder="YYYY"
                placeholder="YYYY"
                aria-label="year"
                aria-valuemin={currentCalendarDate.getFullYear() - 10}
                aria-valuemax={currentCalendarDate.getFullYear() + 10}
                min={currentCalendarDate.getFullYear() - 10}
                max={currentCalendarDate.getFullYear() + 10}
                maxLength={4}
                value={currentCalendarDate.getFullYear()}
                formKey={'year'}
                {...commonInputProps}
            />
        </div>
    );
}
