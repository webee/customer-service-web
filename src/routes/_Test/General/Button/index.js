import React from "react";
import { Card, Button } from "antd";
import Upload from "~/components/Upload";

export default class extends React.Component {
  onUploadChange = e => {
    console.debug("files: ", e.target.files);
  };

  render() {
    return (
      <div>
        <Card title="按钮展示">
          <Button type="primary">Primary</Button>
          <Button>Default</Button>
          <Button type="dashed">Dashed</Button>
          <Button type="danger">Danger</Button>
        </Card>
        <Card title="下载">
          <Upload multiple onChange={this.onUploadChange}>
            <button>Upload</button>
          </Upload>
        </Card>
      </div>
    );
  }
}
