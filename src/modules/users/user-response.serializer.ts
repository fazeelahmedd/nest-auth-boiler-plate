import { UserEntity } from './entities/user.entity';

const userResponseSerializer = (user: UserEntity) => {
  delete user.password;
  // delete user.hash;
  // delete user.previousPassword;
};

export default userResponseSerializer;
