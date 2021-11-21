import '../css/DefinedWord.css';
import pinyinConverter from 'pinyin-tone';

const DefinedWord = (props) => {
    const handleClick = ()=> {
        props.onClick(props.word);
    }
    if (!props.displayPinyin)
    {
        return (<span className="defined-word" onClick={handleClick}>{props.word.simplified}</span>)
    } else
    {
        return <ruby className="defined-word" onClick={handleClick}>{props.word.simplified}<rp>(</rp><rt>{props.convertPinyin ? pinyinConverter(props.word.pinyin) : props.word.pinyin}</rt><rp>)</rp></ruby>;
    }
}

export default DefinedWord;