"use strict";

const { getSequelizeTypeByDesignType } = require("sequelize-typescript");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    /* USERS */
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      flags: Sequelize.DataTypes.INTEGER,
      created_at: Sequelize.DataTypes.DATE,
      updated_at: Sequelize.DataTypes.DATE,
    });
    /* END USERS */

    /* PROFILES */
    await queryInterface.createTable("profiles", {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
        allowNull: false,
      },
      image_url: Sequelize.DataTypes.STRING,
      created_at: Sequelize.DataTypes.DATE,
      updated_at: Sequelize.DataTypes.DATE,
    });
    /* END PROFILES */

    /* WEB3_KEYS */
    await queryInterface.createTable("web3_public_keys", {
      key: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
        allowNull: false,
      },
      created_at: Sequelize.DataTypes.DATE,
      updated_at: Sequelize.DataTypes.DATE,
    });
    /* END WEB3_KEYS */

    // Collections related tables
    await queryInterface.createTable("collections", {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      metadata: Sequelize.DataTypes.JSON,
      status: Sequelize.DataTypes.INTEGER,
      machine_address: Sequelize.DataTypes.STRING,
      mint_start_time: Sequelize.DataTypes.DATE,
      price_gwei: Sequelize.DataTypes.INTEGER,
      name: Sequelize.DataTypes.STRING,
      template_s3_url: Sequelize.DataTypes.STRING,
      user_id: Sequelize.DataTypes.UUID,
      created_at: Sequelize.DataTypes.DATE,
      updated_at: Sequelize.DataTypes.DATE,
    });
    await queryInterface.createTable("items", {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      metadata: Sequelize.DataTypes.JSON,
      s3_url: Sequelize.DataTypes.STRING,
      ipfs_metadata: Sequelize.DataTypes.JSON,
      status: Sequelize.DataTypes.INTEGER,
      num: Sequelize.DataTypes.INTEGER,
      collection_id: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "collections",
          },
          key: "id",
        },
        allowNull: false,
      },
      created_at: Sequelize.DataTypes.DATE,
      updated_at: Sequelize.DataTypes.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("items");
    await queryInterface.dropTable("collections");
    await queryInterface.dropTable("profiles");
    await queryInterface.dropTable("web3_public_keys");
    await queryInterface.dropTable("users");
  },
};
