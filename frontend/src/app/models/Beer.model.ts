export class Beer {
  _id!: string;
  name!: string;
  manufacturer!: string;
  description!: string;
  degree!: number;
  likes!: number;
  dislikes!: number;
  imageUrl!: string;
  mainIngredient!: string;
  usersLiked!: string[];
  usersDisliked!: string[];
  userId!: string;
}
