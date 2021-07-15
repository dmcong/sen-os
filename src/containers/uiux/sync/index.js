import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import isEqual from 'react-fast-compare';

import { Row, Col, Icon, Input, Tooltip, Button, Modal, Typography } from 'sen-kit';
import Policy from './policy';

import PDB from 'helpers/pdb';
import util from 'helpers/util';
import { toggleSync, notify } from 'store/ui.reducer';


class Sync extends Component {
  constructor() {
    super();

    this.state = {
      copied: false,
      reviewed: false,
      link: '',
    }
  }

  componentDidUpdate(prevProps) {
    const { ui: { visibleSync: prevVisibleSync } } = prevProps;
    const { ui: { visibleSync } } = this.props;
    if (!isEqual(prevVisibleSync, visibleSync)) this.onReview(false);
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

  onReview = (reviewed) => {
    return this.setState({ reviewed });
  }

  onBackup = async () => {
    const { wallet: { address } } = this.props;
    const pdb = new PDB(address);
    const cid = await pdb.backup();
    return this.setState({ link: `https://ipfs.io/ipfs/${cid}` });
  }

  onRestore = async () => {
    const { wallet: { address }, notify, toggleSync } = this.props;
    const { link } = this.state;
    const cid = this.parseCID(link);
    if (!cid) return notify({
      type: 'error',
      description: 'Invalid backup link format'
    });
    const pdb = new PDB(address);
    await pdb.restore(cid);
    await toggleSync(false);
    return window.location.reload();
  }

  render() {
    const { ui: { visibleSync }, toggleSync } = this.props;
    const { reviewed, copied, link } = this.state;

    return <Modal
      visible={visibleSync}
      onCancel={() => toggleSync(false)}
      closeIcon={<Icon name="close" />}
      footer={null}
      destroyOnClose={true}
      centered={true}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={5} style={{ margin: 0 }}>Backup & Restore</Typography.Title>
        </Col>
        <Col span={24} />
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
        <Col span={24}>
          <Policy value={reviewed} onChange={this.onReview} />
        </Col>
        <Col span={14}>
          <Button
            type="primary"
            icon={<Icon name="color-wand-outline" />}
            onClick={this.onBackup}
            disabled={!reviewed}
            block
          >Gen a backup link</Button>
        </Col>
        <Col span={10}>
          <Button
            type="text"
            className="contained"
            icon={<Icon name="push-outline" />}
            onClick={this.onRestore}
            block
          >Restore</Button>
        </Col>
      </Row>
    </Modal>
  }
}

const mapStateToProps = state => ({
  ui: state.ui,
  wallet: state.wallet,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleSync, notify,
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Sync));