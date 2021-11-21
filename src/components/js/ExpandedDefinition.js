import '../css/ExpandedDefinition.css';
import pinyinConverter from 'pinyin-tone';

const ExpandedDefinition = (props) => {
    return (
    <div>
        <div className="">
            <ruby className="definition-header">{props.word.simplified}<rp>(</rp><rt>{props.convertPinyin ? pinyinConverter(props.word.pinyin) : props.word.pinyin}</rt><rp>)</rp></ruby>
        </div>
        <div className="">
            <span className="definition-body">{props.word.english}</span>
        </div>
    </div>
    )
}

export default ExpandedDefinition;