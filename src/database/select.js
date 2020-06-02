import SQLite from "react-native-sqlite-storage";
import {  UPDATE_WORK_LIST, LOADING_ALL_TASK } from '../actions/types';

const db = SQLite.openDatabase('multiutilityapp.db');

export const giveAllWork = () => {
    console.log('giveAllWork');
    return dispatch => {
        db.transaction(tx => {
            console.log('inside database')
            tx.executeSql(
                'Select * from USER_WORKS;',
                null,
                (td, results) => {
                    console.log('inside give_all_work action array=>', results.rows);
                    const rows = results.rows;
                    let works = [];

                    for (let i = 0; i <= rows.length; i++) {
                        if (i === rows.length) {
                            console.log('users =>', users);
                            return dispatch({
                                type: UPDATE_WORK_LIST,
                                payload: works
                            });
                        } else {
                            users.push({
                                ...rows.item(i),
                            });
                        }
                    }
                },
                (_, error) => {
                    console.error("Error while selecting work from database.",error);
                }
            );
        }, (error) => {
            console.log('Error while selecting work from database.', error);
        }, () => { console.log('All work selected.'); });
    };
};

export const giveAllTask = (completed, workid, sortBy) => {
    let task_completed = 0;
    console.log('completed, workid, sortBy', completed, workid, sortBy);
    if (completed) { task_completed = 1; }
    else { task_completed = 0; }
    return dispatch => {
        db.transaction(tx => {
            tx.executeSql(`Select * from WORK_TASKS where task_completed=? and workid=? ORDER BY task_createdAt ${sortBy === 'myOrder' ? 'ASC' : 'DESC'}`, [task_completed, workid], (_, results) => {
                console.log('inside give_all_work action array=>', results.rows);
                const rows = results.rows;
                let tasks = [];

                for (let i = 0; i <= rows.length; i++) {
                    if (i === rows.length) {
                        return dispatch({
                            type: LOADING_ALL_TASK,
                            payload: { message: tasks, completed, sortBy }
                        });
                    } else {
                        users.push({
                            ...rows.item(i),
                        });
                    }
                }

            }, (_, error) => {
                console.log('Error while selecting task from databse', error);
            });
        }, (error) => { console.log('Error while selecting task from databse', error); }, () => { console.log('All task selected.'); });
    };
};

