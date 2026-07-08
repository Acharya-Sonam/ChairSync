using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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

        // POST: api/chairs
        [HttpPost]
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