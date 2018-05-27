const Cluster = require("./cluster");

const instances = {};

module.exports = (RED) => {

  function ClusterInNode(n) {
      RED.nodes.createNode(this, n);

      let node = this;
      let clusterConfig = RED.nodes.getNode(n.cluster);

      if (!instances[n.cluster]) {
        instances[n.cluster] = Cluster(clusterConfig);
      }

      const cluster = instances[n.cluster];

      cluster.inputPin(n.pin, n.inverted)
      .then(() => {
        cluster.on('input', (msg) => {
          let _msg = {
            payload: msg
          };

          let pinValue = cluster.getPinValue(1);

          _msg.payload.pin_value = pinValue;

          node.send(_msg);
        });

        node.on('close', () => {
          //cluster.removeAllListeners();
          //cluster.disableAllInterrupts();
        });
      });
  }

  RED.nodes.registerType("cluster-in", ClusterInNode);
};
