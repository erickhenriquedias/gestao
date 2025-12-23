import React from 'react';
import { Activity } from 'lucide-react';
import { ICON_MAP } from '../../constants/icons';

const CategoryIcon = ({ iconName, size = 16, className = "" }) => {
    const IconComponent = ICON_MAP[iconName] || Activity;
    return <IconComponent size={size} className={className} />;
};

export default CategoryIcon;
