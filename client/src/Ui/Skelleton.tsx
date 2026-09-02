import './skeleton.scss'

const Skeleton = () => {
  return (
    <div className="post-card-skeleton">

      <div className="skeleton skeleton-image"></div>

      <div className="skeleton-content">
        <div className="skeleton skeleton-title"></div>

        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text short"></div>

        <div className="skeleton skeleton-button"></div>
      </div>

    </div>
  );
};

export default Skeleton;