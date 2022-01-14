const Machine = artifacts.require("Machine");

module.exports = function (deployer) {
  deployer.deploy(Machine);
};
