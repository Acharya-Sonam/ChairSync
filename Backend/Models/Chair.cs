namespace Backend.Models
{
    public class Chair
    {
        public int Id { get; set; }

        public string ChairNumber { get; set; } = string.Empty;

        public bool IsOccupied { get; set; }
    }
}