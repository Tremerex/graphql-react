import React from 'react';
import PropTypes from 'prop-types';
import Styles from './node.scss';

const Node = ({ id, name, color }) => {
  return (
    <div id={id} className={Styles.container} style={{ background: color }}>
      {name}
    </div>
  );
}

Node.PropTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
};

export default Node;