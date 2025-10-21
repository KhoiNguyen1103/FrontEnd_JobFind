export const transformJobSeekerData = (data) => {
    return data.map(jobSeeker => {
        const { profileId, firstName, lastName, address, title, workExperiences, skills } = jobSeeker;

        const { startDateMin, endDateMax } = workExperiences.reduce(
            (acc, exp) => {
                const startDate = new Date(exp.startDate);
                const endDate = exp.endDate ? new Date(exp.endDate) : new Date();

                if (!acc.startDateMin || startDate < acc.startDateMin) {
                    acc.startDateMin = startDate;
                }
                if (!acc.endDateMax || endDate > acc.endDateMax) {
                    acc.endDateMax = endDate;
                }

                return acc;
            },
            { startDateMin: null, endDateMax: null }
        );

        const totalExperienceYears =
            (endDateMax - startDateMin) / (1000 * 60 * 60 * 24 * 365);

        return {
            profileId,
            firstName,
            lastName,
            title,
            address,
            workExperiences: Math.floor(totalExperienceYears),
            skills,
        };
    });
};
