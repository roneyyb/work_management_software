import {
	ADD_TASK,
	UPDATE_TASK,
	LOADING_ALL_TASK,
	REFRESHING,
	DELETE_TASKS
} from '../actions/types';

import produce from 'immer';
import { combineReducers } from 'redux';

const initialState = {
	byIds: {},
	data: {
		data: [],
		completed: false,
		sortBy: 'myOrder'
	},
	state: {
		loading: false,
		count: 0,
		undotype: '',
		refreshing: false
	}
};

const idReducer = produce((draft, action) => {
	switch (action.type) {
		case ADD_TASK:
			const item = action.payload;
			draft[item.taskid] = item;
			break;
		case LOADING_ALL_TASK:
			var i,
				keys = Object.keys(draft);
			for (i = 0; i < keys.length; i++) {
				delete draft[keys[i]];
			}
			action.payload.message.forEach(item => {
				console.log(item.taskid);
				draft[item.taskid] = item;
			});
			console.log(draft);
			break;
		case DELETE_TASKS:
			const deleteids = action.payload.deleteids;
			deleteids.forEach((item) => {
				delete draft[item.taskid];
			});
			break;
		case UPDATE_TASK:
			draft[action.payload.taskid] = action.payload;
			break;
	}
}, initialState.byIds);

const dataReducer = produce((draft, action) => {
	switch (action.type) {
		case ADD_TASK:
			const item = action.payload;
			if (draft.sortBy == "myOrder") {
				draft.data.push(item.taskid);
			} else {
				draft.data.unshift(item.taskid);
			}
			break;
		case LOADING_ALL_TASK:
			draft.data = [];
			action.payload.message.forEach(item => {
				draft.data.push(item.taskid);
			});
			draft.sortBy = action.payload.sortBy;
			draft.completed = action.payload.completed;
			break;
		case DELETE_TASKS:
			const deleteids = action.payload.deleteids;
			console.log('deletion =>',draft.data);
			deleteids.forEach((item) => {
				const index = draft.data.indexOf(item.taskid);
				draft.data.splice(index, 1);
			});
			console.log('deletion task ->',draft.data);
			break;
	}
}, initialState.data);

const stateReducer = produce(((draft, action) => {
	switch (action.type) {
		case DELETE_TASKS:
			draft.undoType = action.payload.undoType;
			draft.count = action.payload.count;
			break;
		case REFRESHING:
			draft.refreshing = true;
			break;
		case LOADING_ALL_TASK:
			draft.refreshing = false;
			break;
	}
}), initialState.state);

const taskReducer = combineReducers({
	byIds: idReducer,
	state: stateReducer,
	data: dataReducer
});

export default taskReducer;
// const allreducer =  (state = initialState, action) => {
// 	switch (action.type) {
// 		case LOADING_UP_DATA:
// 			return { ...state, loading: true };
// 		case LOADING_DATA_SUCCESS:
// 			return {
// 				...state,
// 				data: action.payload.message,
// 				completed: action.payload.completed,
// 				sortBy: action.payload.sortBy,
// 				loading: false,
// 				refreshing: false,
// 				updatetotaldatalist: true
// 			};
// 		case COMPLETE_SUCCESS:
// 			return { ...state, complete: true };
// 		case SET_DATA_TO_TOTALTASK:
// 			return { ...state, data: action.payload };
// 		case DELETE_WORK_LOADING:
// 			return { ...state, loading: true };
// 		case DELETE_WORK_SUCCESS:
// 			return { ...state, loading: false, data: action.payload.tasklist };
// 		case UNDO_DELETE_TASK_SUCCESS:
// 			return { ...state, data: action.payload.newdata, count: action.payload.count, undotype: action.payload.undoType, updatetotaldatalist: true };
// 		case UNDO_DELETE_TASK_FAIL:
// 			return { ...state, error: action.payload };
// 		case LOADING_DATA_FAIL:
// 			return { ...state, error: action.payload, loading: false };
// 		case REFRESHING:
// 			return { ...state, refreshing: true };
// 		case SEARCH_TASK:
// 			return { ...state, data: action.payload.data, searchvalue: action.payload.searchvalue };
// 		case SEARCH_CHANGE:
// 			return { ...state, search: action.payload };
// 		case CLEAR_ALL_STATE:
// 			return { ...INITIAL_STATE };
// 		case CLEAR_ALL_IN_TASKSHOW:
// 			return {
// 				...INITIAL_STATE,
// 				data: state.data,
// 				sortBy: state.sortBy,
// 				completed: state.completed
// 			};
// 		case SET_UPDATE_DATA_LIST:
// 			return { ...state, updatetotaldatalist: false };
// 		default:
// 			//console.log('action.type in task =>', action);
// 			return state;
// 	}
// };
