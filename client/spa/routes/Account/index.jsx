import './style/index.scss';

import anime from 'animejs';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from './../../actions.js';

// 入口前缀
const prefix = 'Account';

// 子组件
import SignIn from './components/SignIn.jsx';
import Register from './components/Register.jsx';

class Container extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            contentType: 'SIGIN',
            rootEl: null
        }
    }

    componentWillMount () {
        console.log(`${prefix} props => `, this.props);
    }

    componentDidMount () {
        anime({
            targets: this.refs.rootEl,
            translateY: '100%',
            delay: 1000
        });
        this.setState({
            rootEl: this.refs.rootEl
        });
    }

    // 切换表单
    toggleContent = (contentType, callback) => {
        this.setState({
            contentType
        }, callback);
    }

    // 获取显示内容
    getForm () {
        const { rootEl, contentType } = this.state;
        switch(contentType) {
            case 'REGISTER':
                return (
                    <Register toggleContent={ this.toggleContent }
                        rootEl={ rootEl } />
                );
            default:
                return (
                    <SignIn toggleContent={ this.toggleContent }
                        rootEl={ rootEl } />
                );
        }
    }

    render () {
        return (
            <div className="account-container">
                <div ref="rootEl" className="account-content">
                    { this.getForm() }
                </div>
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