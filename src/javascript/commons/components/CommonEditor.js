import React from 'react';
import PropTypes from 'prop-types';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
// import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

class CommonEditor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};

        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        this.convertHtml = this.convertHtml.bind(this);
    }

    componentDidMount() {
        const { value } = this.props;
        return this.convertHtml(value);
    }

    convertHtml(value){
        const contentBlock = htmlToDraft(value);

        if(contentBlock){
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);

            return this.setState({
                editorState,
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.value !== nextProps.value){
            return this.convertHtml(nextProps.value);
        }
    }

    componentDidCatch(error, info) {

    }

    onEditorStateChange(editorState){
        this.setState({
            editorState,
        })
    }

    render() {
        const { toolbars, readOnly, wrapperClassName, editorClassName, toolbarClassName} = this.props;
        const { editorState } = this.state;

        return (
            <div className="common-editor">
                <Editor
                    editorState={editorState}
                    wrapperClassName={wrapperClassName}
                    editorClassName={editorClassName}
                    toolbarClassName={toolbarClassName}
                    onEditorStateChange={this.onEditorStateChange}
                    toolbarHidden={toolbars}
                    toolbarStyle={toolbars ? null : {display:'none'}}
                    readOnly={readOnly}
                    localization={{
                        locale: 'ko',
                    }}
                />
            </div>
        );
    }

}

CommonEditor.propTypes = {
    value: PropTypes.string.isRequired,
    toolbars : PropTypes.bool.isRequired,
    readOnly : PropTypes.bool.isRequired,
    wrapperClassName : PropTypes.string.isRequired,
    editorClassName : PropTypes.string.isRequired,
    toolbarClassName : PropTypes.string.isRequired,
};

CommonEditor.defaultProps = {
    value : "텍스트가 없습니다.",
    toolbars : false,
    readOnly : true,
    wrapperClassName : 'wink-editor-wrapper',
    editorClassName : 'wink-editor-main',
    toolbarClassName : 'wink-editor-toolbar',
};

export default CommonEditor;
