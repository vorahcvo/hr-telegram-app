import React from 'react';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';

interface LoadMoreButtonProps {
  onLoadMore: () => void;
  loading: boolean;
  hasMore: boolean;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ onLoadMore, loading, hasMore }) => {
  if (!hasMore) return null;

  return (
    <div className="py-4">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Button variant="secondary" fullWidth onClick={onLoadMore}>
          Загрузить еще
        </Button>
      )}
    </div>
  );
};

export default LoadMoreButton;