using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("waiting")]
        public async Task<ActionResult<IEnumerable<Customer>>> GetWaitingCustomers()
        {
            return await _context.Customers
                .Where(c => c.Status == "Waiting")
                .ToListAsync();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            return await _context.Customers
                .Include(c => c.Chair)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Customer>> AddCustomer(Customer customer)
        {
            _context.Customers.Add(customer);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCustomers), new { id = customer.Id }, customer);
        }
        [HttpPost("{customerId}/assign/{chairId}")]
        public async Task<IActionResult> AssignChair(int customerId, int chairId)
        {
            var customer = await _context.Customers.FindAsync(customerId);
            var chair = await _context.Chairs.FindAsync(chairId);

            if (customer == null || chair == null)
                return NotFound();

            chair.IsOccupied = true;

            customer.Status = "In Service";
            customer.ChairId = chairId;

            await _context.SaveChangesAsync();

            return Ok();
        }
        [HttpPost("{customerId}/complete")]
        public async Task<IActionResult> CompleteHaircut(int customerId)
        {
            var customer = await _context.Customers.FindAsync(customerId);

            if (customer == null)
                return NotFound();

            if (customer.ChairId != null)
            {
                var chair = await _context.Chairs.FindAsync(customer.ChairId);

                if (chair != null)
                    chair.IsOccupied = false;
            }

            customer.Status = "Completed";
            customer.ChairId = null;

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}