import * as React                                                                      from 'react';
import {Table as MantineTable, ScrollArea, Text} from '@mantine/core';
import {
    PlaceholderBanner
}                                                                                      from "../../components/banners/PlaceholderBanner/PlaceholderBanner";

/**
 * Item
 */
export interface Item {
    lessonId: string
    lessonName: string
    percentageCompletion: number
    href: string
}

/**
 * TableData
 */
export type TableData = {
    loading: boolean
    items: Item[]
}


/**
 * TableProps
 */
export type TableProps = TableData

/**
 * Table
 * @constructor
 * @param props
 */
export function Table(props: TableProps) {
    if(props.items.length === 0){
        return <PlaceholderBanner
            title="No lessons to display"
            description="There are not lessons in badge."
            loading={props.loading}
            icon="badges"
        />
    }

    const rows = props.items.map((row) => {
        const percentageCompletion = Math.round((row.percentageCompletion + Number.EPSILON) * 100)
        return <tr key={row.lessonName}>
            <td>
                <Text<'a'> href={row.href} component='a'>
                    {row.lessonName}
                </Text>
            </td>
            <td>{percentageCompletion}%</td>
        </tr>
    });

    return (
        <ScrollArea.Autosize maxHeight={600}>
            <MantineTable verticalSpacing="sm" sx={{ minWidth: 700 }} highlightOnHover striped>
                <thead>
                <tr>
                    <th>Lesson Name</th>
                    <th>Lesson Completion</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </MantineTable>
        </ScrollArea.Autosize>
    );
}