import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type StudentDocument = Document & Student;

@Schema({ timestamps: true })
export class Student {
  _id: Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ select: false })
  password: string;
}

const StudentSchema = SchemaFactory.createForClass(Student);

// Password hashing middleware
StudentSchema.pre<StudentDocument>('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

StudentSchema.plugin(mongoosePaginate);

export { StudentSchema };
