export default function DifficultyBadge({ difficulty }) {
  const classes = {
    easy: 'badge-easy',
    beginner: 'badge-beginner',
    medium: 'badge-medium',
    intermediate: 'badge-intermediate',
    hard: 'badge-hard',
    advanced: 'badge-advanced',
  };

  return (
    <span className={classes[difficulty] || 'badge-easy'}>
      {difficulty?.charAt(0).toUpperCase() + difficulty?.slice(1)}
    </span>
  );
}
