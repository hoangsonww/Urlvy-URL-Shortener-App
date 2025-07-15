import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { hash } from "../auth/hash.util";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string): Promise<User> {
    if (await this.repo.findOneBy({ email }))
      throw new ConflictException("Email exists");
    const user = this.repo.create({
      email,
      passwordHash: await hash(password),
    });
    return this.repo.save(user);
  }

  findByEmail(email: string) {
    return this.repo.findOneBy({ email });
  }

  findById(id: string) {
    return this.repo.findOneBy({ id });
  }

  async updatePassword(userId: string, newHash: string): Promise<void> {
    await this.repo.update({ id: userId }, { passwordHash: newHash });
  }
}
