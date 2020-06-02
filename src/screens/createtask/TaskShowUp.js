/* eslint-disable react/sort-comp */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SQLite from 'react-native-sqlite-storage';
import Modal from 'react-native-modal';
import PushNotification from 'react-native-push-notification';
import {
    View,
    FlatList,
    Text,
    Alert,
    Animated,
    TouchableHighlight,
    Dimensions,
} from 'react-native';
import { updateTaskInDatabase } from '../../database/updatequeries';

import Modal1 from './components/modal1';
import Modal2 from './components/modal2';
import DeleteModal from './components/generalmodalcomponent';
import Footer from './components/footer';
import Header from './Header';
import Taskeach from './EachTask';
import Logout from '../../database/droptable';
import { giveAllTask } from '../../database/select';
import Datetimemodal from './components/datetimemodal';
import SearchTask from './SearchTask';
import {
    clearAll,
    Searchtask,
    setUpdatelist,
    setloginfalse,
    updateTaskInRedux,
} from '../../actions/taskshowaction';
import { updateTaskInDatabase } from '../../database/updatequeries';
import { cleareverything } from '../../actions/cleareverythingaction';
import { deleteWork } from '../../database/deletequeries';
import { setworkdataaftercloudupdate, deletetheWork } from '../../actions/worklistaction';
import Updatedatatocloud from '../../syncronusupdate/updatedatatocloud';
const whichday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'];
const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

const db = SQLite.openDatabase('multiutilityapp.db');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const SCREEN_WIDTH = Dimensions.get('window').width;
const upadding = Math.round(SCREEN_WIDTH * 0.03);
const Animatedtouchablehighlight = Animated.createAnimatedComponent(
    TouchableHighlight,
);

class Taskshowup extends Component {
    constructor(props) {
        // PushNotification.cancelAllLocalNotifications()
        super(props);
        this.child = this.child;
        this.props.clearAll();
        this.setcolornormal = false;
        this.deleteid = [];
        this.undoinuse = 0;
        this.firsttime = true;
        this.returnflatlistdata = this.returnflatlistdata.bind(this);
        this.state = {
            visibleModal: null,
            visibleWorkModal: false,
            opacity: new Animated.Value(0),
            selected_task: '',
            task_search_enable: false,
            scrollenable: true,
            visibledatetimeModal: true,
            deleteids: [],
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onNavigateBack: this.handleRefresh.bind(this),
        });
        Updatedatatocloud(this.props.userid,this.updatinglocalworklist,this.handleRefresh);
        this.props.navigation.setParams({ title: this.props.title });
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.updatetotaldatalist) {
            this.totaldata = nextProps.data;
            nextProps.setUpdatelist();
        }

        if (nextProps.updatetaskdata) {
            nextProps.setloginfalse();
            nextProps.giveAllTask(
                nextProps.completed,
                nextProps.workid,
                nextProps.sortBy,
            );
        }

        return true;
    }
    componentWillUnmount() {
        this.props.clearAll();
    }

    updatinglocalworklist = worklistbackend => {
        this.props.setworkdataaftercloudupdate(
            this.props.worklist,
            worklistbackend,
        );
    };

    handleRefresh = () => {
        // this.props.navigation.setParams({
        //     onNavigateBack: this.handleRefresh.bind(this),
        // });
        //this.props.navigation.setParams({ title: this.props.title });

        this.props.giveAllTask(
            this.props.completed,
            this.props.workid,
            this.props.sortBy,
        );
    };

    renderSeparator = () => (
        <View
            style={{
                height: 1,
                width: '86%',
                backgroundColor: '#CED0CE',
                marginLeft: '14%',
            }}
        />
    );

    renderHeader = () => (
        <View style={{ flexDirection: 'row', justifyContent: 'center', height: 40 }}>
            <View
                style={styles.headerStyle}>
                <Text style={{ color: '#8D8D8C', padding: 10 }}>
                    {`${this.props.title.toUpperCase()}`}
                </Text>
            </View>
        </View>
    );

    returnflatlistdata() {
        if (!this.firsttime) {
            return this.props.task.;
        }
        this.firsttime = false;
        return [];
    }

    forceRerender = () => {
        this.setState({ state: this.state });
    };

    deleted = () => {
        this.deleteid = [];
        this.props.giveAllTask(
            this.props.completed,
            this.props.workid,
            this.props.sortBy,
        );
    };
    setColordefault = () => {
        this.setcolornormal = true;
        this.deleteid = [];
        this.forceRerender();
    };

    handleViewRef = ref => (this.position = ref);

    onBackdropPress = state => {
        this.setState({ visibleModal: state });
    };
    onCancelPressDeleteModal = state => {
        this.setState({ visibleWorkModal: state });
    };

    ClearAllState() {
        this.props.cleareverything();
    }

    a = '';

    waitUndo = (deleteids, type) => {
        const workid = {
            workid: this.props.workid,
            workidbackend: this.props.workidbackend,
        };
        this.a = setTimeout(() => {
            this.resetUndo(deleteids, type, workid);
        }, 4000);
    };

    resetUndo = (deleteids, undotype, workid) => {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 1,
        }).start();
        this.undoinuse--;
        const todaydate = new Date();
        const s = 'sdf';
        if (undotype === 'complete' || undotype === 'incomplete') {
            db.transaction(
                tx => {
                    if (undotype === 'complete') {
                        var completed = 1;
                    } else var completed = 0;

                    deleteids.forEach(taskid => {
                        tx.executeSql(
                            'update work_tasks set task_completed=?, task_completedAt=? where taskid=?',
                            [completed, todaydate.toString(), taskid.taskid],
                            () => {
                                tx.executeSql(
                                    'Insert into TASK_DATA_UPDATE(update_type, workid, taskid) values(?,?,?)',
                                    ['UPDATE', workid.workid, taskid.taskid],
                                    () => { },
                                    error => { },
                                );
                            },
                            (_, error) =>
                                Alert.alert('problem in deleting ids from database', error),
                        );
                    });
                },
                error => { },
                () => { },
            );
        } else {
            db.transaction(tx => {
                deleteids.forEach(taskid => {
                    tx.executeSql(
                        'delete from work_tasks where taskid=?',
                        [taskid.taskid],
                        () => {
                            tx.executeSql(
                                'Insert into TASK_DATA_UPDATE(update_type, workid, taskid, task_pehchan) values(?,?,?,?)',
                                [
                                    'DELETE',
                                    workid.workidbackend,
                                    taskid.taskid_backend,
                                    taskid.taskid,
                                ],
                                () => { },
                                error => { },
                            );
                        },
                        (_, error) =>
                            Alert.alert('problem in deleting ids from database', error),
                    );
                });
            });
        }
    };

    deleteMultipletask = (deleteids, type) => {
        this.deleteid = [];
        this.callUndo(deleteids, type);
    };

    undoalreadyinuse = async (deleteids, type) => {
        await clearTimeout(this.a);
        const workid = {
            workid: this.props.workid,
            workidbackend: this.props.workid_backend,
        };
        this.resetUndo(this.state.deleteid, this.state.undotype, workid);
        this.setState({ deleteid: deleteids, undotype: type });
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }).start(this.waitUndo(deleteids, type));
    };

    callUndo = (deleteids, type) => {
        if (this.undoinuse === 0) {
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 500,
            }).start(this.waitUndo(deleteids, type));
            this.setState({ deleteid: deleteids, undotype: type });
            this.undoinuse++;
        } else {
            this.undoalreadyinuse(deleteids, type);
            this.undoinuse++;
        }
    };

    deletingWorkconfirmation = () => {
        const { workid, workidbackend, defaultwork, completed, sortBy } = this.props;
        this.props.deleteWork(workid,workidbackend);
        this.props.deletetheWork(workid,defaultwork);
        this.props.giveAllTask(sortBy,defaultwork.workid,completed);
    };

    renderFooter = () => {
        return <View style={{ height: 70, width: SCREEN_WIDTH }} />;
    };

    changescroll = change => {
        this._eachtask.setNativeProps({ scrollEnabled: change });
    };

    settingNotificationmodal = (visibledatetimeModal, selected_task) => {
        this.setState({ visibledatetimeModal, selected_task });
    };

    onChangeDeadline = (dates, time, visibledatetimeModal, notificationid) => {
        const date = new Date(dates);
        const day = whichday[date.getDay()];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        if (time !== 'Select Deadline Time') {
            if (year > new Date().getFullYear()) {
                var deadline = `${day}, ${date.getDate()} ${month}, ${date.getFullYear()}, ${time}`;
            } else {
                var deadline = `${day}, ${date.getDate()} ${month}, ${time}`;
            }
        } else {
            if (year > new Date().getFullYear()) {
                var deadline = `${day}, ${date.getDate()} ${month}, ${date.getFullYear()}`;
            } else {
                var deadline = `${day}, ${date.getDate()} ${month}`;
            }
        }

        PushNotification.cancelLocalNotifications({
            id: this.state.selected_task.task_notificationid,
        });

        const {
            task_title: title,
            task_description: description,
            workid: workid,
            taskid: taskid,
            task_reminder: reminder,
            task_updatedAt: updatedAt,
            workid_backend: workid_backend,
        } = this.state.selected_task;

        updateTaskInDatabase({
                title,
                description,
                workid,
                taskid,
                reminder,
                updatedAt,
                workid_backend,
                notificationid,
                deadline,
        });
        this.props.updateTaskInRedux({ ...this.state.selected_task, task_deadline: deadline });
        this.setState({ visibledatetimeModal, selected_task: '' });
    }

    ondate = value => {
        this.setState({ visibledatetimeModal: value });
    };

    settaskSearch = value => {
        this.setState({ task_search_enable: value });
    };

    undoaction = async () => {
        if (this.state.task_search_enable) {
            this.searchtask.undoaction();
        }
        await clearTimeout(this.a);
        await Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 100,
        }).start();
        this.undoinuse = 0;
        this.setState({ deleteids: [] });
        await this.props.giveAllTask(
            this.props.completed,
            this.props.workid,
            this.props.sortBy,
        );
    };
    setfootertouch = value => {
        this.footer.setpointer(value);
    };

    loggingout = () => {
        Updatedatatocloud(this.props.userid);
        setTimeout(() => {
            Logout();
        }, 5000);
    };

    render() {
        const { navigation } = this.props;
        const undosize = this.state.opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        });

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                }}
                accessible>
                <AnimatedFlatList
                    data={this.returnflatlistdata()}
                    renderItem={({ item, index }) => (
                        <Taskeach
                            callUndo={this.callUndo}
                            settingNotificationmodal={this.settingNotificationmodal}
                            setcolornormal={this.setcolornormal}
                            Makeremoterequest={this.props.giveAllTask}
                            index={index}
                            Searchtask={false}
                            navigation={navigation}
                            deleteid={this.deleteid}
                            items={item}
                            setColordefault={this.setColordefault.bind(this)}
                            handleRefresh={this.handleRefresh.bind(this)}
                            changeflip={this.child.changeflip}
                            Deletetaskcountnumber={this.child.Deletetaskcountnumber}
                            changescroll={this.changescroll}
                        />
                    )}
                    ref={component => (this._eachtask = component)}
                    contentContainerStyle={styles.flatList}
                    scrollEnabled
                    keyExtractor={item => item.taskid}
                    ListFooterComponent={this.renderFooter}
                    onRefresh={this.handleRefresh.bind(this)}
                    refreshing={this.props.refreshing}
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={6}
                />

                <Footer
                    ref={refer => {
                        this.footer = refer;
                    }}
                    navigation={this.props.navigation}
                    callUndo={this.props.callUndo}
                    completed={this.props.completed}
                    onBackdropPress={this.onBackdropPress}
                />
                <Header
                    ref={childe => {
                        this.child = childe;
                    }}
                    setpointer={this.setfootertouch}
                    callUndo={this.callUndo}
                    settaskSearch={this.settaskSearch}
                    Makeremoterequest={this.props.giveAllTask}
                    settingNotificationmodal={this.settingNotificationmodal}
                    navigation={navigation}
                    handleRefresh={this.handleRefresh.bind(this)}
                    deleteid={this.deleteid}
                    deleteMultipletask={this.deleteMultipletask}
                    deleted={this.deleted.bind(this)}
                    setColordefault={this.setColordefault}
                    cleareverything={this.ClearAllState.bind(this)}
                />
                {this.state.task_search_enable ? (
                    <SearchTask
                        ref={searchtask => {
                            this.searchtask = searchtask;
                        }}
                        callUndo={this.callUndo}
                        settaskSearch={this.settaskSearch}
                        settingNotificationmodal={this.settingNotificationmodal}
                        Makeremoterequest={this.props.giveAllTask}
                        navigation={navigation}
                        deleteid={this.deleteid}
                        handleRefresh={this.handleRefresh.bind(this)}
                        changescroll={this.changescroll}
                    />
                ) : (
                        <View />
                    )}
                <Animated.View
                    style={style.undoContainer}>
                    <Animated.Text
                        style={styles.undoCountText}>
                        {`${this.props.count} ${this.props.undoTypetitle} `}
                    </Animated.Text>
                    <Animatedtouchablehighlight
                        style={styles.undoButton}
                        underlayColor={'#87cefa33'}
                        onPress={() => {
                            this.undoaction();
                        }}>
                        <Animated.Text
                            style={{
                                fontSize: upadding * 1.3,
                                opacity: undosize,
                                fontWeight: 'bold',
                                color: '#FFA500',}}>
                            {'Undo'}
                        </Animated.Text>
                    </Animatedtouchablehighlight>
                </Animated.View>
                <Modal
                    isVisible={this.state.visibleModal === 1}
                    useNativeDriver
                    onBackdropPress={() => {
                        this.onBackdropPress(null);
                    }}
                    style={styles.Modal2}>
                    <Modal2
                        cleareverything={this.props.cleareverything}
                        navigation={this.props.navigation}
                        email={this.props.email}
                        Logout={this.loggingout}
                        onBackdropPress={this.onBackdropPress}
                    />
                </Modal>
                <DeleteModal
                    visibleornot={this.state.visibleWorkModal}
                    cancelFunction={this.onCancelPressDeleteModal}
                    actiononbuttonpress={this.deletingWorkconfirmation}
                    title={'Deleting the work'}
                    message={
                        'This action cannot be undo. If you delete the work all your related task will be deleted.'
                    }
                    Rightbuttontitle={'Cancel'}
                    Leftbuttontitle={'Delete'}
                />
                <Modal
                    isVisible={this.state.visibledatetimeModal === 1}
                    useNativeDriver
                >
                    <Datetimemodal
                        onChangeDeadline={this.onChangeDeadline}
                        setOpacity={this.setOpacity}
                        onDate={this.ondate}
                        title={this.state.selected_task.task_title}
                        description={this.state.selected_task.task_description}
                    />
                </Modal>
                <Modal
                    isVisible={this.state.visibleModal === 2}
                    useNativeDriver
                    onBackdropPress={() => {
                        this.onBackdropPress(null);
                    }}
                    style={{ justifyContent: 'flex-end', margin: 0 }}
                >
                    <Modal1
                        onCancelPressDeleteModal={this.onCancelPressDeleteModal}
                        Makeremoterequest={this.props.giveAllTask}
                        navigation={this.props.navigation}
                        //handleRefresh={this.handleRefresh}
                        onBackdropPress={this.onBackdropPress}
                    />
                </Modal>
            </View>
        );
    }
}

const mapStatetoprops = state => {
    return {
        data: state.task.data,
        state: state.task.state,
        loading: state.show.state.loading,
        refreshing: state.show.state.refreshing,
        data: state.show.data,
        error: state.show.error,
        searchvalue: state.show.searchvalue,
        undoTypetitle: state.show.undotype,
        count: state.show.count,
        completed: state.show.completed,
        search: state.show.search,
        updatetotaldatalist: state.show.updatetotaldatalist,
        sortBy: state.show.sortBy,
        updatetaskdata: state.worklist.updatetaskdata,
        selectedwork: state.worklist.selectedwork,
        worklist: state.worklist.data,
        workid: state.worklist.selectedwork.workid,
        title: state.worklist.selectedwork.work_title,
        workidbackend: state.worklist.selectedwork.workid_backend,
        email: state.user.email,
        userid: state.user._id,
        defaultwork: state.user.work
    };
};

export default connect(
    mapStatetoprops,
    {
        deletetheWork,
        deleteWork,
        giveAllTask,
        Refreshing,
        updateTaskInRedux,
        updateTaskInDatabase,
        setworkdataaftercloudupdate,
        clearAll,
        Searchtask,
        setUpdatelist,
        cleareverything,
        setloginfalse,
    },
)(Taskshowup);

const styles = StyleSheet.create({
    flatList: {
        paddingTop: upadding / 2,
        paddingTop: upadding * 4.5,
    },
    Modal2: {
        justifyContent: 'flex-end',
        margin: 0,
        borderRadius: upadding * 1.5,
    },
    undoButton: {
        elevation: 24,
        height: upadding * 3,
        width: upadding * 4,
        borderRadius: upadding / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    undoContainer: {
        position: 'absolute',
        bottom: upadding * 9,
        alignSelf: 'center',
        opacity: this.state.opacity,
        padding: upadding * 1.5,
        height: upadding * 4,
        width: SCREEN_WIDTH - upadding * 1.5,
        borderRadius: upadding / 2,
        elevation: upadding * 2,
        backgroundColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    undoCountText: {
        fontSize: upadding * 1.2,
        opacity: undosize,
        color: 'white',
    },
    headerStyle: {
        elevation: 5,
        flexDirection: 'row',
        backgroundColor: 'white',
        backgroundColor: 'white',
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    }

});