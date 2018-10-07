import './style/index.scss';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from './../../actions';

// 入口前缀
const prefix = 'UserInfo';

// 公共模块
import request from './../../common/modules/request.js';
import cookieUtil from './../../common/modules/cookie-util.js';

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
            avatorUrl: null,
            ifShowEditTextDialog: false,
            ifShowUploadImgDialog: false
        }
    }

    componentWillMount () {
        __DEV__ && console.log(`${prefix} props => `, this.props);
    }

    componentDidMount () {
        this.setState({
            avatorUrl: localStorage['avatorUrl']
        });
    }

    // 上传头像数据
    postAvatorData = (receiveParams) => {
        const { formData } = receiveParams;
        const { site, version } = window.Waydua;
        const { width, height, offsetX, offsetY } = receiveParams;

        // 数据封装
        formData.append('user_token', cookieUtil.get('login_token'));

        request({
            method: 'POST',
            url: `http://${site}/${version}/file/upload_avator`,
            data: formData,
            type: 'multipart/form-data',
            success: (res) => {
                const avatorUrl = res.data['avator_url'];

                localStorage['avatorUrl'] = avatorUrl;
                this.setState({
                    avatorUrl,
                    ifShowUploadImgDialog: false
                });
            },
            fail: (err) => {
                console.error(err);
            }
        });
    }

    // 更新用戶名
    updateUserName = ({ name }) => {
        const { site, version } = window.Waydua;
        request({
            method: 'POST',
            url: `http://${site}/${version}/user/update_name`,
            data: {
                'user_token': cookieUtil.get('login_token'),
                'user_name': name
            },
            success: (res) => {
                if (res.result === 1) {
                    Object.assign(localStorage, {
                        userName: res.data['user_name']
                    });
                }
            },
            fail: (err) => {
                console.error(err);
            }
        });
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
        const {
            ifShowEditTextDialog,
            ifShowUploadImgDialog,
            avatorUrl
        } = this.state;
        const uploadImgDialogProps = {
            ifShowDialog: ifShowUploadImgDialog,
            title: '修改头像',
            receiveParams: this.postAvatorData
        };
        const editTextDialogProps = {
            ifShowDialog: ifShowEditTextDialog,
            title: '修改昵称',
            btns: [
                { text: '取消' },
                {
                    text: '确定',
                    listener: this.updateUserName
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
                    avatorUrl={ avatorUrl }
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
