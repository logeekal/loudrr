import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import CommentWidget from '../src';

const App: FC<{}> = () => {
    return <CommentWidget domainKey={"1021f131-5ce2-4823-8a20-3879bde9f410"}/>
}

ReactDOM.render(<App />, document.getElementById('react'));

