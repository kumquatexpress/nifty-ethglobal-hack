"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(
      "collections",
      "discord_guild_id",
      Sequelize.DataTypes.STRING
    );
    await queryInterface.addColumn(
      "collections",
      "discord_role_id",
      Sequelize.DataTypes.STRING
    );
    await queryInterface.addColumn(
      "users",
      "discord_user_id",
      Sequelize.DataTypes.STRING
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("collections", "discord_guild_id");
    await queryInterface.removeColumn("collections", "discord_role_id");
    await queryInterface.removeColumn("collections", "discord_user_id");
  },
};
