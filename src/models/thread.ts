import mongoose, { Types } from 'mongoose';
import { Models } from '@/consts';

export interface IThread {
  text: string
  author: Types.ObjectId
  community: Types.ObjectId
  parentId?: Types.ObjectId
  children: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

export const ThreadSchema = new mongoose.Schema<IThread>({
  text: {
    type: String,
    require: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Models.USER,
    required: true
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Models.COMMUNITY,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Models.THREAD,
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: Models.THREAD,
  }],
}, { timestamps: true })

ThreadSchema.pre<IThread>('deleteOne', async function () {
  const childrenId = this.children

  await mongoose.models?.Thread.deleteMany({ _id: { $in: childrenId}})
})

const Thread = mongoose.models?.Thread as mongoose.Model<IThread> || mongoose.model(Models.THREAD, ThreadSchema)

export default Thread