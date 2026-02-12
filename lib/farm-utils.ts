
export function inferStructure(name: string): string {
    const lower = name.toLowerCase();

    // Structures
    if (lower.includes('barn') || lower.includes('shed') || lower.includes('store') || lower.includes('warehouse')) return 'barn';
    if (lower.includes('greenhouse') || lower.includes('tunnel') || lower.includes('nursery')) return 'greenhouse';
    if (lower.includes('house') || lower.includes('home') || lower.includes('cottage') || lower.includes('residence')) return 'house';
    if (lower.includes('pump') || lower.includes('water') || lower.includes('well') || lower.includes('irrigation')) return 'irrigation';
    if (lower.includes('silo') || lower.includes('tank') || lower.includes('storage')) return 'storage';
    if (lower.includes('generator') || lower.includes('power') || lower.includes('solar') || lower.includes('panel')) return 'generator';

    // Specific Crops implies Field
    if (lower.includes('maize') || lower.includes('corn') || lower.includes('wheat') || lower.includes('rice') ||
        lower.includes('bean') || lower.includes('potato') || lower.includes('tomato') || lower.includes('vegetable') ||
        lower.includes('garden') || lower.includes('orchard') || lower.includes('field') || lower.includes('plot') ||
        lower.includes('farm') || lower.includes('land')) return 'field';

    return 'field'; // Default
}

export function inferCropType(name: string, structure: string): string | undefined {
    if (structure !== 'field' && structure !== 'greenhouse') return undefined;

    const lower = name.toLowerCase();

    if (lower.includes('maize') || lower.includes('corn')) return 'Maize';
    if (lower.includes('wheat')) return 'Wheat';
    if (lower.includes('rice')) return 'Rice';
    if (lower.includes('bean')) return 'Beans';
    if (lower.includes('potato')) return 'Potatoes';
    if (lower.includes('tomato')) return 'Tomatoes';
    if (lower.includes('coffee')) return 'Coffee';
    if (lower.includes('tea')) return 'Tea';
    if (lower.includes('onion')) return 'Onions';
    if (lower.includes('carrot')) return 'Carrots';

    return undefined;
}

export function inferColor(structure: string, cropType?: string): string {
    if (structure === 'barn' || structure === 'house' || structure === 'storage') return 'brown';
    if (structure === 'greenhouse' || structure === 'irrigation') return 'lightgreen';
    if (structure === 'generator') return 'darkgreen';

    // Crops
    if (cropType) {
        const lower = cropType.toLowerCase();
        if (lower.includes('maize') || lower.includes('corn') || lower.includes('wheat') || lower.includes('sunflower')) return 'yellow';
        if (lower.includes('coffee') || lower.includes('tea')) return 'darkgreen';
    }

    return 'primary'; // Default green
}
