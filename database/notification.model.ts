import { Schema, models, model, Document } from 'mongoose';

export interface INotification extends Document {
  recipient: Schema.Types.ObjectId; // The user who will receive the notification
  trigger: Schema.Types.ObjectId;   // The user who triggered the notification
  type: 'new_answer' | 'new_reply'; // Type of notification
  question: Schema.Types.ObjectId;  // Reference to the question
  answer?: Schema.Types.ObjectId;  // Reference to the answer (if applicable)
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  trigger: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['new_answer', 'new_reply'], required: true },
  question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  answer: { type: Schema.Types.ObjectId, ref: 'Answer' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = models.Notification || model<INotification>('Notification', NotificationSchema);

export default Notification; 