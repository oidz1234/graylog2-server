import React from 'react';
import Reflux from 'reflux';
import { Col, Row } from 'react-bootstrap';

import DeflectorStore from 'stores/indices/DeflectorStore';
import IndexRangesStore from 'stores/indices/IndexRangesStore';
import IndicesStore from 'stores/indices/IndicesStore';

import DeflectorActions from 'actions/indices/DeflectorActions';
import IndexRangesActions from 'actions/indices/IndexRangesActions';
import IndicesActions from 'actions/indices/IndicesActions';

import DocsHelper from 'util/DocsHelper';
import { PageHeader, Spinner } from 'components/common';
import { DocumentationLink } from 'components/support';
import { IndicesMaintenanceDropdown, IndicesOverview } from 'components/indices';

const IndicesPage = React.createClass({
  mixins: [Reflux.connect(IndicesStore), Reflux.connect(DeflectorStore), Reflux.connect(IndexRangesStore)],
  REFRESH_INTERVAL: 2000,
  componentDidMount() {
    const timerId = setInterval(() => {
      DeflectorActions.config();
      DeflectorActions.list();

      IndexRangesActions.list();

      IndicesActions.list();
    }, this.REFRESH_INTERVAL);
    this.setState({timerId: timerId});
  },
  componentWillUnmount() {
    clearInterval(this.state.timerId);
  },
  render() {
    if (!this.state.indices || !this.state.indexRanges || !this.state.deflector) {
      return <Spinner />;
    }
    return (
      <span>
        <PageHeader title="Indices">
          <span>
            This is an overview of all indices (message stores) Graylog is currently taking in account
            for searches and analysis. You can learn more about the index model in the{' '}
            <DocumentationLink page={DocsHelper.PAGES.INDEX_MODEL} text="documentation" />.
            Closed indices can be re-opened at any time.
          </span>

          <span>
          </span>

          <IndicesMaintenanceDropdown />
        </PageHeader>

        <IndicesOverview indices={this.state.indices} deflector={this.state.deflector} indexRanges={this.state.indexRanges} />
      </span>
    );
  },
});

export default IndicesPage;
