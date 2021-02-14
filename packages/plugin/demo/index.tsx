import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import CommentWidget from '../src';

const App: FC<{}> = () => {
    return <CommentWidget domainKey={"362ac97c-26ec-40ab-80ea-f22044768d2c"}/>
}

ReactDOM.render(<App />, document.getElementById('react'));

