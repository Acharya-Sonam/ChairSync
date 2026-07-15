namespace Backend.Models
{
    public class Customer
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public int TokenNumber { get; set; }

        public string Service { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string Status { get; set; } = "Waiting";

        public int? ChairId { get; set; }

        public Chair? Chair { get; set; }
    }
}