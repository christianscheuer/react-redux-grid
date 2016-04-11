import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { Editor } from './cell/Editor.jsx';

import { prefix } from '../../util/prefix';
import { stateGetter } from '../../util/stateGetter';
import { handleEditClick } from '../../util/handleEditClick';
import { elementContains } from '../../util/elementContains';
import { CLASS_NAMES } from '../../constants/GridConstants';

export const Cell = (
    { cellData, columns, editor, editorState, events, index, rowData, rowIndex, rowId, selectionModel, store }
) => {

    const isEditable = editorState
            && editorState.row
            && editorState.row.key === rowId;

    const hidden = columns
            && columns[index]
            && columns[index].hidden !== undefined
            ? columns[index].hidden
            : null;

    const cellClickArguments = {
        events, columns, cellData, editor, editorState, rowIndex, rowData, rowId, selectionModel, store
    };

    const cellProps = {
        className: prefix(CLASS_NAMES.CELL),
        onClick: handleClick.bind(this, cellClickArguments),
        onDoubleClick: handleDoubleClick.bind(this, cellClickArguments),
        style: {}
    };

    if (hidden) {
        cellProps.style.display = 'none';
    }

    const cellHTML = getCellHTML(cellData, editorState, isEditable, columns, index, rowId, store);

    return (
        <td { ...cellProps }>
            { cellHTML }
        </td>
        );
};

export const getCellHTML = (cellData, editorState, isEditable, columns, index, rowId, store) => {

    const editorProps = {
        cellData,
        columns,
        editorState,
        index,
        isEditable,
        rowId,
        store
    };

    return (
        <Editor { ...editorProps } />
    );
};

export const handleClick = (
    { events, columns, cellData, editor, editorState, rowIndex, rowData, rowId, selectionModel, store }, reactEvent
) => {

    if (reactEvent.target && elementContains(reactEvent.target, prefix(CLASS_NAMES.EDITED_CELL))) {
        reactEvent.stopPropagation();
    }

    if (selectionModel.defaults.editEvent === selectionModel.eventTypes.singleclick) {

        if (!editorState || Object.keys(editorState).length === 0) {
            handleEditClick(editor, store, rowId, rowData, rowIndex, columns, { reactEvent });
        }

        else if (editorState && editorState.row && editorState.row.rowIndex !== rowIndex) {
            handleEditClick(editor, store, rowId, rowData, rowIndex, columns, { reactEvent });
        }
    }

    if (events.HANDLE_CELL_CLICK) {
        return events.HANDLE_CELL_CLICK.apply(this, arguments);
    }
};

export const handleDoubleClick = (
    { events, columns, cellData, editor, editorState, rowIndex, rowData, rowId, selectionModel, store }, reactEvent
) => {

    if (reactEvent.target && elementContains(reactEvent.target, prefix(CLASS_NAMES.EDITED_CELL))) {
        reactEvent.stopPropagation();
    }

    if (selectionModel.defaults.editEvent === selectionModel.eventTypes.doubleclick) {
        handleEditClick(editor, store, rowId, rowData, rowIndex, { reactEvent });
    }

    if (events.HANDLE_CELL_DOUBLE_CLICK) {
        return events.HANDLE_CELL_DOUBLE_CLICK.apply(this, arguments);
    }
};

Cell.propTypes = {
    cellData: PropTypes.any,
    columns: PropTypes.array,
    data: PropTypes.func,
    editorState: PropTypes.object,
    events: PropTypes.object,
    index: PropTypes.number,
    rowData: PropTypes.object,
    rowId: PropTypes.string,
    selectionModel: PropTypes.object,
    store: PropTypes.object
};

function mapStateToProps(state, props) {
    return {
        editorState: stateGetter(state, props, 'editor', 'editorState')
    };
}

const ConnectedCell = connect(mapStateToProps)(Cell);

export { Cell, ConnectedCell };