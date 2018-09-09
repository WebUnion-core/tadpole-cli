import './style/index.scss';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from './../../actions';

// 入口前缀
const prefix = 'UserInfo';

// 公共组件
import HeadBar from './../../common/components/HeadBar';
import EditTextDialog from './../../common/components/EditTextDialog';
import UploadImgDialog from './../../common/components/UploadImgDialog';

// 子组件
import FirstLevelList from './components/FirstLevelList.jsx';

class Container extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            ifShowEditTextDialog: false,
            ifShowUploadImgDialog: false
        }
    }

    componentWillMount () {
        console.log(`${prefix} props => `, this.props);
    }

    // 切换输入型对话框状态
    toggleEditTextDialog = (status) => {
        const { ifShowEditTextDialog } = this.state;
        this.setState({
            ifShowEditTextDialog: status || !ifShowEditTextDialog,
            ifShowUploadImgDialog: false
        });
    }

    // 切换上传图片型对话框状态
    toggleUploadImgDialog = (status) => {
        const { ifShowUploadImgDialog } = this.state;
        this.setState({
            ifShowEditTextDialog: false,
            ifShowUploadImgDialog: status || !ifShowUploadImgDialog
        });
    }

    render () {
        const { ifShowEditTextDialog, ifShowUploadImgDialog } = this.state;
        const uploadImgDialogProps = {
            ifShowDialog: ifShowUploadImgDialog,
            title: '修改头像',
            btns: [
                {
                    text: '上传',
                    listener: (data) => alert(data.name)
                }
            ]
        };
        const editTextDialogProps = {
            ifShowDialog: ifShowEditTextDialog,
            title: '修改昵称',
            btns: [
                { text: '取消' },
                {
                    text: '确定',
                    listener: (data) => alert(data.name)
                }
            ],
            exitTextList: [
                {
                    placeholder: '请输入昵称',
                    field: 'name',
                    type: 'text'
                }
            ]
        };

        return (
            <div className="user-info-container">
                <HeadBar title="个人信息" />
                <FirstLevelList
                    toggleEditTextDialog={ this.toggleEditTextDialog }
                    toggleUploadImgDialog={ this.toggleUploadImgDialog } />

                <UploadImgDialog { ...uploadImgDialogProps } />

                <EditTextDialog { ...editTextDialogProps } />
            </div>
        )
    }
}

// 将state对应值绑定到props上
function mapStateToProps(state) {
    return {
        [prefix]: state[prefix]
    }
}

// 将action的所有方法绑定到props上
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

// 通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Container);
