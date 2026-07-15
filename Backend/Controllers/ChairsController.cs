using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChairsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ChairsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/chairs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Chair>>> GetChairs()
        {
            return await _context.Chairs.ToListAsync();
        }

        // GET: api/chairs/board — chairs plus whichever customer currently occupies each one
        [HttpGet("board")]
        public async Task<ActionResult<IEnumerable<object>>> GetChairBoard()
        {
            var chairs = await _context.Chairs.ToListAsync();
            var activeCustomers = await _context.Customers
                .Where(c => c.Status == "In Service" && c.ChairId != null)
                .ToListAsync();

            var board = chairs.Select(chair =>
            {
                var customer = activeCustomers.FirstOrDefault(c => c.ChairId == chair.Id);
                return new
                {
                    chair.Id,
                    chair.ChairNumber,
                    chair.IsOccupied,
                    chair.OccupiedSince,
                    CustomerId = customer?.Id,
                    CustomerName = customer?.Name,
                    Service = customer?.Service,
                    Price = customer?.Price
                };
            });

            return Ok(board);
        }

        // POST: api/chairs
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Chair>> AddChair(Chair chair)
        {
            _context.Chairs.Add(chair);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetChairs), new { id = chair.Id }, chair);
        }

        // PUT: api/chairs/1
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateChair(int id, Chair updatedChair)
        {
            if (id != updatedChair.Id)
            {
                return BadRequest();
            }

            _context.Entry(updatedChair).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/chairs/1
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteChair(int id)
        {
            var chair = await _context.Chairs.FindAsync(id);

            if (chair == null)
            {
                return NotFound();
            }

            _context.Chairs.Remove(chair);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}