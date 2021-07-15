import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
  Row, Col, Icon, Input, Tooltip,
  Button, Badge, Popover
} from 'sen-kit';

import PDB from 'helpers/pdb';
import util from 'helpers/util';
import { notify } from 'store/ui.reducer';


class Sync extends Component {
  constructor() {
    super();

    this.state = {
      copied: false,
      link: '',
    }
  }

  parseCID = (link) => {
    const elements = link.split('/');
    while (elements.length) {
      const element = elements.pop();
      if (PDB.isCID(element)) return element;
    }
    return null;
  }

  onLink = (e) => {
    const link = e.target.value || '';
    return this.setState({ link });
  }

  onCopy = async () => {
    this.setState({ copied: true });
    await util.asyncWait(1500);
    this.setState({ copied: false });
  }

  onBackup = async () => {
    const { wallet: { address } } = this.props;
    const pdb = new PDB(address);
    const cid = await pdb.backup();
    return this.setState({ link: `https://ipfs.io/ipfs/${cid}` });
  }

  onRestore = async () => {
    const { wallet: { address }, notify } = this.props;
    const { link } = this.state;
    const cid = this.parseCID(link);
    if (!cid) return notify({
      type: 'error',
      description: 'Invalid backup link format'
    });
    const pdb = new PDB(address);
    const data = await pdb.restore(cid);
    console.log(data);
  }

  render() {
    const { copied, link } = this.state;

    return <Popover
      overlayStyle={{ maxWidth: 370 }}
      content={<Row gutter={[8, 8]}>
        <Col span={24}>
          <Input
            placeholder="https://ipfs.io/ipfs/..."
            prefix={<Button
              type="link"
              size="small"
              style={{ marginLeft: -7 }}
              icon={<Icon name="cube-outline" />}
              href={link || 'https://ipfs.io/ipfs/QmT2riVFg143e8HWBxZCisRnHvDRVMfNHhcFYBnQgTsYtU'}
              target="_blank"
              rel="noopener noreferrer"
            />}
            suffix={<Tooltip title="Copied" visible={copied}>
              <CopyToClipboard text={link} onCopy={this.onCopy} >
                <Button
                  type="text"
                  size="small"
                  style={{ marginRight: -7 }}
                  icon={<Icon name="copy-outline" />}
                  disabled={!link}
                />
              </CopyToClipboard>
            </Tooltip>}
            value={link}
            onChange={this.onLink}
          />
        </Col>
        <Col span={16}>
          <Button
            type="primary"
            icon={<Icon name="link-outline" />}
            onClick={this.onBackup}
            block
          >Gen a backup link</Button>
        </Col>
        <Col span={8}>
          <Button
            type="text"
            className="contained"
            icon={<Icon name="link-outline" />}
            onClick={this.onRestore}
            block
          >Restore</Button>
        </Col>
      </Row>}
      trigger="click"
      placement="bottom"
    >
      <Badge status="success">
        <Button
          type="text"
          className="contained"
          icon={<Icon name="cloudy-outline" />}
        />
      </Badge>
    </Popover>
  }
}

const mapStateToProps = state => ({
  wallet: state.wallet,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  notify,
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Sync));