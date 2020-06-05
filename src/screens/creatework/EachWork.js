import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { changeSelectedWork } from '../../actions/worklistaction';
import { giveAllTask } from '../../database/select';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const upadding = Math.round(SCREEN_WIDTH * 0.03);


class Item extends Component {

    onPressWork = (work) => {
        const { selectedwork } = this.props;
        if (work.workid !== selectedwork.workid) {
            this.props.changeSelectedWork(work);
            this.props.giveAllTask(work.workid);
        }
        this.props.navigation.navigate('task');
        // this.props.dataupdates(
        //     this.props.data,
        //     this.props.item.workid
        // );
    }

    render() {
        const work = this.props.byIds[this.props.item];
        const { selectedwork } = this.props;
        return (
            <View style={styles.container}>
                <View style={[{
                    backgroundColor: work.workid===selectedwork.workid
                        ? `${this.props.color}66`
                        : 'white'
                }, styles.containerInside]}
                >
                    <View style={styles.identity}>
                        <View style={[ styles.identityInside , {
                            backgroundColor: `${this.props.color}CC`}]}>
                            {
                                work.work_title.length !== 0 ?
                                <Text style={{ color: 'white', fontSize: upadding * 1.5 }}>
                                    {`${work.work_title[0]}`}
                                </Text>
                                :
                                <View />    
                            }
                        </View>
                    </View>
                    <View style={{ flex: 8, justifyContent: 'center' }}>
                        <TouchableOpacity
                            onPress={() => { this.onPressWork(work); }}
                            style={{
                                height: 30,
                                marginLeft: 8
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: upadding * 1.2,
                                    fontWeight: 'bold',
                                    color: selectedwork.workid === work.workid
                                        ? `${this.props.color}`
                                        : '#8D8D8C'
                                }}
                            >{`${work.work_title}`}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        byIds: state.worklist.byIds,
        selectedwork: state.worklist.state.selectedwork,
    }
}
export default connect(mapStateToProps, { changeSelectedWork, giveAllTask })(Item);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: upadding * 4,
        marginTop: upadding / 2,
        paddingRight: upadding * 5
    },
    containerInside: {
        flexDirection: 'row',
        flex: 1,
        borderTopRightRadius: upadding * 2,
        borderBottomRightRadius: upadding * 2
    },
    identityContainer: { flex: 2, alignItems: 'center', justifyContent: 'center' },
    identityInside: {
        height: upadding * 3,
        width: upadding * 3,
        borderRadius: upadding * 1.5,
        justifyContent: 'center',
        alignItems: 'center'
    },

});