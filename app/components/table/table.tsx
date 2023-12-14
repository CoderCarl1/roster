import { createId } from '@paralleldrive/cuid2';
import React, {
    ReactElement,
    Children,
    isValidElement /** , cloneElement, ReactHTMLElement */,
} from 'react';

type variantTypes = 'default';
type TableProps = {
    variant?: variantTypes;
    children?: React.ReactNode;
} & React.HTMLProps<HTMLTableElement>;
type CaptionProps = {
    children?: React.ReactNode;
} & React.HTMLProps<HTMLTableCaptionElement>;
type TableHeadProps = {
    children?: React.ReactNode;
} & React.HTMLProps<HTMLTableSectionElement>;
type THProps = {
    children?: React.ReactNode;
} & React.HTMLProps<HTMLTableCellElement>;
type TableBodyProps = {
    children?: React.ReactNode;
} & React.HTMLProps<HTMLTableSectionElement>;
type RowProps = {
    cb?: () => void;
    children?: React.ReactNode;
} & React.HTMLProps<HTMLTableRowElement>;
type TDProps = {
    rowLength?: number;
    children?: React.ReactNode;
} & React.HTMLProps<HTMLTableCellElement>;

type tableDataProps = {
    caption: ReactElement | null;
    head: ReactElement[];
    headProps: TableHeadProps;
    body: ReactElement[];
    bodyProps: TableBodyProps;
};

function Table({ variant = 'default', children, ...props }: TableProps) {
    let rowLength = 1;
    let tableData = {
        caption: null,
        head: [],
        headProps: {},
        body: [],
        bodyProps: {},
    } as tableDataProps;

    const unfilteredChildren = Children.map(children, (child) => {
        if (!isValidElement(child)) return null;

        const checkElementType = (
            ...elementTypesToCheck: (string | React.ComponentType<any>)[]
        ) => {
            const elementType =
                typeof child.type === 'string'
                    ? child.type.toLowerCase()
                    : child.type;

            return elementTypesToCheck.some((type) => {
                if (typeof type === 'string') {
                    return type.toLowerCase() === elementType;
                } else {
                    return type === child.type;
                }
            });
        };

        if (checkElementType(TableHead, 'thead')) {
            tableData = { ...tableData, headProps: child.props };
        } else if (checkElementType(TableBody, 'tbody')) {
            tableData = { ...tableData, bodyProps: child.props };
        } else if (checkElementType('th', TH)) {
            tableData = { ...tableData, head: [...tableData.head, child] };
        } else if (checkElementType('row', Row)) {
            tableData = { ...tableData, body: [...tableData.body, child] };
        } else if (checkElementType('caption', Caption)) {
            tableData = { ...tableData, caption: child };
        } else {
            return child;
        }
        return null;
    });

    const tableHeadElement = () => {
        const { head, headProps } = tableData;
        rowLength = head.length;

        return (
            <TableHead {...headProps}>
                <Row>
                    {head.map((thElement) => {
                        return (
                            <TH key={createId()} {...thElement.props}>
                                {thElement.props.children}
                            </TH>
                        );
                    })}
                </Row>
            </TableHead>
        );
    };

    const TableBodyElement = () => {
        const { body, bodyProps } = tableData;

        if (!body.length) {
            return (
                <TableBody {...bodyProps}>
                    <Row>
                        <TD colSpan={rowLength}>No Data</TD>
                    </Row>
                </TableBody>
            );
        }

        return (
            <TableBody {...bodyProps}>
                {body.map((rowElement) => (
                    <Row key={createId()} {...rowElement.props}>
                        {Children.map(
                            rowElement.props.children,
                            (nestedChild) => (
                                <TD key={createId()} {...nestedChild.props}>
                                    {nestedChild.props.children}
                                </TD>
                            )
                        )}
                    </Row>
                ))}
                {unfilteredChildren}
            </TableBody>
        );
    };

    return (
        <table className={'[ table ]' + `[ variant-${variant} ]`} {...props}>
            {tableData.caption}
            {tableHeadElement()}
            {TableBodyElement()}
        </table>
    );
}

function Caption({ children, ...props }: CaptionProps) {
    return <caption {...props}>{children}</caption>;
}

function TableHead({ children, ...props }: TableHeadProps) {
    return <thead {...props}>{children}</thead>;
}

function TH({ children, ...props }: THProps) {
    return <th {...props}>{children}</th>;
}

function TableBody({ children, ...props }: TableBodyProps) {
    return <tbody {...props}>{children}</tbody>;
}

function Row({ cb, children, ...props }: RowProps) {
    return (
        <tr {...props} onClick={cb}>
            {children}
        </tr>
    );
}

function TD({ rowLength = 1, children, ...props }: TDProps) {
    return (
        <td colSpan={rowLength} {...props}>
            {children}
        </td>
    );
}

Table.Caption = Caption;
Table.TableHead = TableHead;
Table.TH = TH;
Table.TableBody = TableBody;
Table.Row = Row;
Table.TD = TD;

export { Table as default, Caption, TableHead, TH, TableBody, Row, TD };
