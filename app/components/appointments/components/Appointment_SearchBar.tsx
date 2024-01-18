import { ElementRef, useEffect, useMemo, useRef, useState } from 'react';
import { TAppointmentWithCustomerNameAndFullAddress } from '@types';
import { debounce, joinClasses } from '@functions';
import UseClickOutside from '~/functions/helpers/useClickOutside';
import {
    AppointmentProvider,
    useAppointments,
} from '../appointment.hooks';
import FilterBar from '../../general/FilterBar';
import { Button } from '../../general';

type searchBarProps = React.HTMLProps<HTMLDivElement>;

export default function Main({ ...props }: searchBarProps) {
    return (
        <AppointmentProvider>
            <AppointmentSearchBar {...props} />
        </AppointmentProvider>
    );
}

function AppointmentSearchBar({ ...props }: searchBarProps) {
    const [results, setResults] = useState<TAppointmentWithCustomerNameAndFullAddress[]>([]);
    const {appointmentsList} = useAppointments();
    const [searchTerm, setSearchTerm] = useState('');
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null); // Track the focused result index;
    const [searchIsCollapsed, setSearchIsCollapsed] = useState(true);
    const searchBarRef = UseClickOutside<ElementRef<'div'>>({
        cb: () => setSearchIsCollapsed(true),
    });
    const [invalidSearch, setInvalidSearch] = useState(false);
    const cancelDebouncedSearch = useMemo(() => {
        return debounce<string>({
            func: () => {
                setInvalidSearch(false);
                const lowerCaseSearchTerm = searchTerm.toLowerCase();
                const filteredResultsMap = new Map<
                    string,
                    TAppointmentWithCustomerNameAndFullAddress
                >();
                appointmentsList.forEach((appointment) => {
                    const address = appointment.fullAddress?.toLowerCase();
                    const fullName = appointment.fullName?.toLowerCase() || '';
                    if (
                        address &&
                        (address.includes(lowerCaseSearchTerm) ||
                            fullName.includes(lowerCaseSearchTerm))
                    ) {
                        filteredResultsMap.set(address, appointment);
                    }
                });
                const filteredArray = Array.from(filteredResultsMap.values()).sort((a, b) =>
                (a?.fullName || '').localeCompare(b?.fullName || '')
                );
                if (filteredArray.length) {
                    setResults(filteredArray);
                } else {
                    setInvalidSearch(true);
                }
                setFocusedIndex(null);
            },
            delay: 300,
            args: '',
        });
    }, [searchTerm]);

    useEffect(() => {
        return cancelDebouncedSearch();
    }, [cancelDebouncedSearch]);

    // useEffect(() => {
    //   const handleKeyDown = (event: KeyboardEvent) => {
    //     switch (event.key) {
    //       case 'Enter':
    //         if (focusedIndex !== null && focusedIndex < results.length) {
    //           console.log(`Focus result: ${focusedIndex}`);
    //         }
    //         break;
    //       case 'Tab':
    //         if (event.shiftKey) {
    //           // Handle Shift+Tab to cycle backward
    //           event.preventDefault();
    //           setFocusedIndex((prevIndex) => (prevIndex === null ? null : (prevIndex - 1 + results.length) % results.length));
    //         } else {
    //           // Handle Tab to cycle forward
    //           event.preventDefault();
    //           setFocusedIndex((prevIndex) => (prevIndex === null ? 0 : (prevIndex + 1) % results.length));
    //         }
    //         break;
    //       case 'Escape':
    //         setFocusedIndex(null);
    //         setResults([]);
    //         break;
    //       default:
    //         break;
    //     }
    //   };

    //   document.addEventListener('keydown', handleKeyDown);
    //   return () => {
    //     document.removeEventListener('keydown', handleKeyDown);
    //   };
    // }, [focusedIndex, results]);

    function handleChange(text: string) {
        setSearchTerm(text);
    }

    useEffect(() => {
        function handleClassNameAllocations() {
            setSearchIsCollapsed(false);
            searchBarRef.current?.classList.toggle('carl', !searchIsCollapsed);
        }
        searchBarRef.current?.addEventListener(
            'click',
            handleClassNameAllocations
        );
        return () => {
            searchBarRef.current?.removeEventListener(
                'click',
                handleClassNameAllocations
            );
        };
    }, []);
    return (
        <div ref={searchBarRef} className="search-bar__wrapper" {...props}>
            <FilterBar
                className={joinClasses(
                    'search-bar',
                    invalidSearch ? 'invalid' : ''
                )}
                cb={handleChange}
            />
            <AppointmentResultsBar
                collapsed={searchIsCollapsed}
                focusedIndex={focusedIndex}
                results={results}
            />
        </div>
    );
}

type appointmentResultsBarProps = {
    results: TAppointmentWithCustomerNameAndFullAddress[];
    collapsed: boolean;
    focusedIndex: number | null;
};
function AppointmentResultsBar({
    results,
    collapsed,
    focusedIndex,
}: appointmentResultsBarProps) {
    const { setAppointment } = useAppointments();
    return (
        <div
            className={joinClasses(
                'search-bar__results flow',
                collapsed ? 'collapse' : ''
            )}
        >
            {results.map((appointment, index) => {
                return (
                    <Button
                        key={appointment.id}
                        className={joinClasses(
                            'search-bar__results--result',
                            focusedIndex === index ? 'current' : ''
                        )}
                        onClick={() => setAppointment(appointment)}
                    >
                        <span className="result__name">
                            {appointment.fullName}
                        </span>
                        <span className="result__address">
                            {appointment.fullAddress}
                        </span>
                    </Button>
                );
            })}
        </div>
    );
}
