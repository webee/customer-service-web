import styles from "./index.less";

export default class extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // audio ref
    this.audio = undefined;
  }

  // resetPlaying = ()=> {
  //   this.audio.pause();
  //   this.audio.currentTime = 0;
  // }

  render() {
    const { msg, as_description } = this.props;
    if (as_description) {
      return `[语音] ${msg.duration}s`;
    }

    const { url, duration } = msg;

    return (
      <div className={styles.main}>
        <audio ref={ref => (this.audio = ref)} src={url} controls preload="metadata" controlsList="nodownload">
          [浏览器不支持语音]
        </audio>
      </div>
    );
  }
}
