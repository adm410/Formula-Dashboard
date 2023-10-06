import fastf1
import datetime

seasonYear = datetime.date.today().year


def nextRace(seasonYear):
  while True:
    try:
      remaining_events = fastf1.get_events_remaining()
      raceRound = remaining_events.iloc[0, 0]

      event = fastf1.get_event(seasonYear, raceRound)
      print(f'Round: {raceRound}')
      print(event.EventName)
      print()
      for i in range(1, 6):
        session_name = event.get_session_name(i)
        session_date_utc = getattr(event, f'Session{i}DateUtc')
        print(f'{session_name}: {session_date_utc}')

      print()
      print(f'{event.Location}, {event.Country}')
      return
    except ValueError:
      seasonYear -= 1


nextRace(seasonYear)
