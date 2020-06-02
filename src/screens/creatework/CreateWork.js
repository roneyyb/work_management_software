import React from 'react';
import {
    TextInput,
    TouchableHighlight,
    View,
    Text,
    Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { uuidv1 } from 'uuid/v1';
import {
    addWork,
    updatetheWork
} from '../../actions/worklistaction';
import {
    createWork
} from '../../database/createqueries';
import {
    updateWorkInDatabase
} from '../../database/updatequeries';

import { giveAllTask } from '../../database/select';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const upadding = Math.round(SCREEN_WIDTH * 0.03);

class Creatework extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: () =>
            <Text style={{ color: '#8D8D8C', fontSize: upadding * 1.3, fontWeight: 'bold' }}>
                {`${navigation.getParam('update') ? 'UPDATE WORK' : 'CREATE WORK'}`}
            </Text>
        ,
        headerRight: () =>
            <TouchableHighlight
                underlayColor={'#2B65EC33'}
                style={{
                    height: upadding * 3,
                    width: upadding * 4,
                    borderRadius: upadding / 2,
                    alignItems: 'center',
                    marginRight: upadding,
                    justifyContent: 'center'
                }}
                onPress={
                    navigation.getParam('update', false)
                        ? navigation.getParam('updating', () => { })
                        : navigation.getParam('creating', () => { })
                }
            >
                <Text style={{ fontSize: upadding * 1.3, color: '#2B65EC', fontWeight: 'bold' }}>
                    1{navigation.getParam('update', false)?'CREATE':'UPDATE'}
                </Text>
            </TouchableHighlight>
        ,
        headerTintColor: '#8D8D8C'
    });

    constructor(props) {
        super(props);
        this.activatecreatework = true;
        const update = props.navigation.getParam('update', false);
        if (update) {
            this.state = {
                work: props.selectedwork.work_title,
                update: true
            }
        } else {
            this.state = {
                work: '',
                update: false
            }
        }
    }


    componentDidMount() {
        this.props.navigation.setParams({ creating: this.onCreate.bind(this), updating: this.onUpdate.bind(this) });
    }

    componentWillUnmount() {
        this.props.clearallwork();
    }

    onUpdate() {
        const data = { ...this.props.selectedwork, work_title: this.state.work };
        this.props.updatetheWork(data);
        updateWorkInDatabase(this.props.selectedwork.workid, this.state.work);
        this.props.navigation.navigate('task');
    }

    onCreate() {
        const uuid = uuidv1();
        const data = {
            work_title: this.state.work,
            workid: uuid,
            work_created: new Date().toString(),
            work_selected: 0,
            work_deadline: "",
            workid_bakcend:""
        }
        this.props.addWork(data);
        createWork(data);
        this.props.navigation.navigate('task');
    }

    onChanges(value) {
        this.setState({ work: value });
    }

    render() {

        return (
            <View style={{ backgroundColor: `${'#D3D3D3'}80`, flex: 1 }}>
                <View
                    style={{
                        backgroundColor: 'white',
                        justifyContent: 'flex-start',
                        elevation: 4
                    }}
                >
                    <TextInput
                        style={{
                            height: upadding * 5,
                            marginRight: upadding * 2,
                            marginLeft: upadding * 2,
                            fontWeight: 'bold',
                            color: 'black',
                            fontSize: upadding * 1.3
                        }}
                        autoFocus = {true}
                        value={this.state.work}
                        onChangeText={this.onChanges.bind(this)}
                        placeholder={'Enter work title'}
                        autoCorrect={false}
                        multiline
                        placeholderTextColor='#8D8D8C'
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {

    return {
        selectedwork: state.worklist.selectedwork,
    };
};
export default connect(
    mapStateToProps,
    {
        updatetheWork,
        addWork,
        onChangework,
        clearallwork,
        setState
    }
)(Creatework);