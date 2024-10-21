import React from 'react';
import styles from './TagsFilter.module.scss';

type TagFilterProps = {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tags: string[]) => void; // 修改为接收数组
  onClearAll: () => void; // 接收 onClearAll 函数
  classname?: string;
};

const TagsFilter: React.FC<TagFilterProps> = ({
  tags,
  selectedTags,
  onTagSelect,
}) => {
  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      // 如果标签已被选中，则移除它
      onTagSelect(selectedTags.filter((selectedTag) => selectedTag !== tag));
    } else {
      // 否则添加标签
      onTagSelect([...selectedTags, tag]);
    }
  };

  return (
    <div className={styles.tagFilterContainer}>
      {tags.map((tag) => (
        <button
          key={tag}
          className={`${styles.tagButton} ${selectedTags.includes(tag) ? styles.active : ''}`}
          onClick={() => handleTagClick(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagsFilter;
