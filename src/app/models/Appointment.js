import Sequelize, { Model } from 'sequelize';

class Appointments extends Model {
  static init(sequelize) {
    super.init({
      day: Sequelize.STRING,
      date: Sequelize.DATE,
      canceled_at: Sequelize.DATE,
    }, {
      sequelize,
    });

    return this;
  }

  static associate(model) {
    this.belongsTo(model.User, { foreignKey: 'user_id', as: 'user' });
  }
}
export default Appointments;
