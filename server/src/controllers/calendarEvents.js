const CalendarEvent = require('../models/calendarEvents');
const User = require('../models/users');
const ProductionCompany = require('../models/productionCompanies')

/////////////////////
// standard routes //
/////////////////////
const getCalendarEvents = async (req, res, next) => {
    try {
        const calendarEvents = await CalendarEvent.findAll();

        if (!calendarEvents) {
            return res.status(404).json('No events found')
        }
        const plainCalendarEvents = calendarEvents.map(event => event.get({ plain: true }))
        return res.status(200).json(plainCalendarEvents)
    }
    catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const getCalendarEventById = async (req, res, next) => {
    try {
        const calendarEvent = await CalendarEvent.findByPK(req.params.id)
        if (!calendarEvent) {
            return res.status(404).json('Event was not found')
        }
        const plainCalendarEvent = calendarEvent.get({ plain: true })
        return res.status(200).json(plainCalendarEvent)
    }
    catch (error) {
        return res.status(500).json({error: error.message})
    }
}

const createCalendarEvent = async (req, res) => {
    try {
        const { startDate, endDate, eventName, productionId } = req.body;
        const { username, email } = await req.user;

        const user = await User.findOne({ 
            where: {
                username: username,
                email: email
            } 
        });

        const plainUser = await user.get({ plain: true })
        // console.log('Within Post Control: ', plainUser.id)

        if (plainUser) {
            commentableType = 'user',
            commentableId = plainUser.id
        } else {
            const productionCompany = await ProductionCompany.findOne({ 
                where: { 
                    username: username, 
                    email: email 
                }
            });
            commentableType = 'productionCompany',
            commentableId = productionCompany.id
        }
    
        // Create a new CalendarEvent
        const newEvent = await CalendarEvent.create({
            startDate,
            endDate,
            productionId,
            eventName,
            commentableId,
            commentableType,
        });
    
        return res.status(201).json(newEvent);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create CalendarEvent' });
    }
}

const updateCalendarEvent = async (req, res, next) => {
    try {
        const { startDate, endDate, eventName, productionId } = req.body;

        const updatedEvent = await CalendarEvent.update(
            {
                startDate,
                endDate,
                eventName,
                productionId,
            },
            {
                where: { id: req.params.id },
                returning: true,
            }
        );

        if (!updatedEvent[0]) {
            return res.status(404).json('Event not found');
        }

        const plainUpdatedEvent = updatedEvent[1][0].get({ plain: true });
        return res.status(200).json(plainUpdatedEvent);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update CalendarEvent' });
    }
};

const deleteCalendarEvent = async (req, res, next) => {
    try {
        await CalendarEvent.destroy({where: {id: req.params.id}})
        return res.status(200).json({})
    }
    catch (error) {
        return res.status(500).json({error: error.message})
    }
}

///

const getCalendarEventsByPC = async (req, res, next) => {
    try {
        const { pcId } = req.params;

        const calendarEvents = await CalendarEvent.findAll({
            where: {
                commentableType: 'productionCompany',
                commentableId: pcId,
            },
        });

        if (!calendarEvents) {
            return res.status(404).json('No events found for the production company');
        }

        const plainCalendarEvents = calendarEvents.map((event) => event.get({ plain: true }));
        return res.status(200).json(plainCalendarEvents);

    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch CalendarEvents' });
    }
};

const getCalendarEventsByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const calendarEvents = await CalendarEvent.findAll({
            where: {
                commentableType: 'user',
                commentableId: userId,
            },
        });

        if (!calendarEvents || calendarEvents.length === 0) {
            return res.status(404).json('No events found');
        }

        const plainCalendarEvents = calendarEvents.map((event) => event.get({ plain: true }));
        return res.status(200).json(plainCalendarEvents);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getCalendarEvents,
    getCalendarEventById,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    getCalendarEventsByPC,
    getCalendarEventsByUser
}