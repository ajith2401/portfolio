export class ConstraintSystem {
    calculateLayout(sections, constraints) {
        const layout = {};

        for (const section of sections) {
            const sectionConstraints = constraints[section.name];
            if (!sectionConstraints) {
                console.warn(`Constraints not defined for section "${section.name}". Using defaults.`);
                layout[section.name] = this.getDefaultLayout(section, constraints.dimensions);
                continue;
            }

            layout[section.name] = this.calculateSectionLayout(section, sectionConstraints, constraints.dimensions);
        }

        return this.resolveConstraints(layout, constraints);
    }

    calculateSectionLayout(section, constraints, globalDimensions = { width: 1200, height: 1200 }) {
        const layout = {
            x: 0,
            y: 0,
            width: constraints.width || globalDimensions.width || 1200, // Default to global width
            height: constraints.height || 'auto', // Default to auto height
            minHeight: constraints.minHeight || 0, // Default to 0
            maxHeight: constraints.maxHeight || globalDimensions.height || 1200, // Default to global height
            minWidth: constraints.minWidth || 0, // Default to 0
            maxWidth: constraints.maxWidth || globalDimensions.width || 1200 // Default to global width
        };

        // Handle additional constraints
        if (constraints.pinBottom) {
            layout.pinBottom = true;
        }

        if (constraints.spanColumns) {
            layout.spanColumns = true;
        }

        // Validate numerical dimensions
        this.validateDimensions(layout, section.name);

        return layout;
    }

    getDefaultLayout(section, globalDimensions = { width: 1200, height: 1200 }) {
        return {
            x: 0,
            y: 0,
            width: globalDimensions.width,
            height: 'auto', // Default height is flexible
            minHeight: 0, // Default to 0
            maxHeight: globalDimensions.height, // Use global height
            minWidth: 0, // Default to 0
            maxWidth: globalDimensions.width // Use global width
        };
    }

    resolveConstraints(layout, globalConstraints) {
        Object.entries(layout).forEach(([sectionName, sectionLayout]) => {
            // Ensure layout exists
            if (!sectionLayout) {
                console.warn(`Missing layout for section "${sectionName}".`);
                return;
            }
    
            // Validate and set height
            if (!sectionLayout.height || isNaN(sectionLayout.height)) {
                const maxHeightPercentage = parseFloat(sectionLayout.maxHeight) / 100 || 0.2;
                sectionLayout.height = globalConstraints.dimensions.height * maxHeightPercentage;
            }
    
            // Validate other properties as needed
            if (!sectionLayout.width) {
                sectionLayout.width = globalConstraints.dimensions.width || 1200; // Default width
            }
        });
    
        return layout;
    }
    
      

    validateDimensions(layout, sectionName) {
        if (isNaN(layout.width) || layout.width === undefined) {
            console.warn(`Invalid width detected for section "${sectionName}". Defaulting to 0.`);
            layout.width = 0;
        }

        if (isNaN(layout.height) || layout.height === undefined) {
            console.warn(`Invalid height detected for section "${sectionName}". Defaulting to 'auto'.`);
            layout.height = 'auto';
        }
    }
}
