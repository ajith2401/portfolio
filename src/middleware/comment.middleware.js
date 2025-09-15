// src/middleware/comment.middleware.js
import { Writing, TechBlog, Project } from '@/models';

export async function initializeCommentsArray(doc, Model) {
  if (!doc.comments) {
    // Initialize comments array if it doesn't exist
    await Model.findByIdAndUpdate(doc._id, { $set: { comments: [] } }, { new: true });
  }
}

export async function handleCommentOperations(commentData, operation = 'create') {
  let parent;
  const { parentId, parentModel } = commentData;

  // Determine the correct model
  const Model = {
    'Writing': Writing,
    'TechBlog': TechBlog,
    'Project': Project
  }[parentModel];

  if (!Model) {
    throw new Error(`Invalid parent model: ${parentModel}`);
  }

  // Get the parent document
  parent = await Model.findById(parentId);
  if (!parent) {
    throw new Error('Parent document not found');
  }

  // Initialize comments array if needed
  await initializeCommentsArray(parent, Model);

  return { parent, Model };
}

export async function updateCommentStats(parent, Model) {
  try {
    // Get all ratings for the parent document
    const stats = await Model.aggregate([
      { $match: { _id: parent._id } },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'parentId',
          pipeline: [
            { $match: { status: 'approved' } }
          ],
          as: 'approvedComments'
        }
      },
      {
        $project: {
          averageRating: { 
            $cond: {
              if: { $gt: [{ $size: '$approvedComments' }, 0] },
              then: { $avg: '$approvedComments.rating' },
              else: 0
            }
          },
          totalRatings: { $size: '$approvedComments' },
          totalComments: { $size: '$approvedComments' }
        }
      }
    ]);

    if (stats.length > 0) {
      // Update the parent document with new stats
      await Model.findByIdAndUpdate(parent._id, {
        $set: {
          averageRating: Math.round(stats[0].averageRating * 10) / 10, // Round to 1 decimal
          totalRatings: stats[0].totalRatings,
          'performance.comments': stats[0].totalComments
        }
      });
    }
  } catch (error) {
    console.error('Error updating comment stats:', error);
    throw error;
  }
}