export const getFormattedDate = (date) => {
    return date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    }).replace(/ /g, "-")
}