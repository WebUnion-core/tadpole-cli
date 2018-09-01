// 导出方法
const setOwnMsgData = (newData = {}, props) => {
    const { ownMsgData } = props;
    Object.assign(ownMsgData, newData);

    return {
        type: 'SET_<MODULE_NAME />_DATA', // type属性一定要有
        ownMsgData
    }
};

export default {
    setOwnMsgData
};