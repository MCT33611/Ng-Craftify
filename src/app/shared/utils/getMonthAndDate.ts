export function getMonthAndDate(dateString: string): { month: string; date: number } {
    // Create a Date object from the string
    const date = new Date(dateString);
  
    // Get the month index (0-based) and convert it to a human-readable month (0 = January, 11 = December)
    const monthIndex = date.getMonth();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = months[monthIndex];
  
    // Get the date (day of the month)
    const dateNumber = date.getDate();
  
    // Return the month and date as an object
    return { month, date: dateNumber };
  }
  
  
  
  