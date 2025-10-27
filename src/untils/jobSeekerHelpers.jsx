export const transformJobSeekerData = (data) => {
    return data.map(jobSeeker => {
        const { profileId, userId, firstName, lastName, address, avatar, birthDay, title, workExperiences = [], skills = [] } = jobSeeker;

        let totalExperienceYears = 0;

        if (Array.isArray(workExperiences) && workExperiences.length > 0) {
            const { startDateMin, endDateMax } = workExperiences.reduce(
                (acc, exp) => {
                    const startDate = exp.startDate ? new Date(exp.startDate) : null;
                    const endDate = exp.endDate ? new Date(exp.endDate) : new Date();

                    if (startDate) {
                        if (!acc.startDateMin || startDate < acc.startDateMin) {
                            acc.startDateMin = startDate;
                        }
                        if (!acc.endDateMax || endDate > acc.endDateMax) {
                            acc.endDateMax = endDate;
                        }
                    }

                    return acc;
                },
                { startDateMin: null, endDateMax: null }
            );

            if (startDateMin && endDateMax) {
                totalExperienceYears =
                    (endDateMax - startDateMin) / (1000 * 60 * 60 * 24 * 365);
            }
        }

        return {
            profileId,
            userId,
            firstName,
            lastName,
            title,
            address,
            avatar,
            birthDay,
            workExperiences: Math.floor(totalExperienceYears),
            skills,
        };
    });
};
